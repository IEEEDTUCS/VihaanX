import {
  CHECKPOINT_PUBLIC_ID_PREFIX,
  CHECKPOINT_ROUNDS,
  ERROR_CODES,
  IMAGE_FIELD_NAME,
  IMAGE_MIME_TYPES,
  IMAGE_REVIEWED_NOTE,
  PROJECT_PUBLIC_ID,
} from "../config/constants";
import type { CheckpointRound, TeamWorld } from "../config/constants";
import { env } from "../config/env";
import {
  CHECKPOINT_WINDOWS,
  PROJECT_WINDOW,
  graceSeconds,
  windowState,
} from "../config/event";
import type { SubmissionWindow } from "../config/event";
import { toPublicTracks } from "../config/tracks";
import { ParticipantModel } from "../models/participant.model";
import { TeamModel } from "../models/team.model";
import type { Checkpoint, Project, Team } from "../models/team.model";
import {
  hardwareCheckpointBody,
  hardwareProjectBody,
  softwareCheckpointBody,
  softwareProjectBody,
} from "../schemas/submission.schema";
import { ApiError } from "../utils/ApiError";
import { detectImageMimeType } from "../utils/imageType";
import { parseOrThrow } from "../utils/parseInput";
import { uploadSubmissionImage } from "./cloudinary.service";
import {
  checkCommit,
  checkProjectRepo,
  parseCommitUrl,
} from "./github.service";
import type { CheckResult } from "./github.service";

type TeamRecord = Team & { _id: unknown };

export type SubmissionImage = { buffer: Buffer; mimetype: string } | null;

const teamNotFound = () =>
  new ApiError(404, "Team not found", ERROR_CODES.NOT_FOUND);

export const emptyProject = (): Project => ({
  tracks: [],
  description: "",
  repoUrl: null,
  imageUrl: null,
  submittedAt: null,
  autoStatus: "NOT_SUBMITTED",
  autoFlags: [],
  autoNotes: [],
  reviewStatus: null,
  reviewNote: null,
  reviewedBy: null,
});

export const emptyCheckpoint = (round: number): Checkpoint => ({
  round,
  url: null,
  commitSha: null,
  submittedAt: null,
  autoStatus: "NOT_SUBMITTED",
  autoFlags: [],
  autoNotes: [],
  reviewStatus: null,
  reviewNote: null,
  reviewedBy: null,
});

export const projectOf = (team: Pick<Team, "project">): Project =>
  team.project ?? emptyProject();

export const checkpointsOf = (team: Pick<Team, "checkpoints">): Checkpoint[] =>
  CHECKPOINT_ROUNDS.map(
    (round) =>
      team.checkpoints?.find((entry) => entry.round === round) ??
      emptyCheckpoint(round),
  );

export const toParticipantProject = (project: Project) => ({
  tracks: toPublicTracks(project.tracks),
  description: project.description,
  repoUrl: project.repoUrl,
  imageUrl: project.imageUrl,
  submittedAt: project.submittedAt,
  autoStatus: project.autoStatus,
  autoFlags: project.autoFlags,
  autoNotes: project.autoNotes,
  reviewStatus: project.reviewStatus,
});

export const toParticipantCheckpoint = (checkpoint: Checkpoint) => ({
  round: checkpoint.round,
  url: checkpoint.url,
  commitSha: checkpoint.commitSha,
  submittedAt: checkpoint.submittedAt,
  autoStatus: checkpoint.autoStatus,
  autoFlags: checkpoint.autoFlags,
  autoNotes: checkpoint.autoNotes,
  reviewStatus: checkpoint.reviewStatus,
});

export const toAdminProject = (project: Project) => ({
  ...toParticipantProject(project),
  reviewNote: project.reviewNote,
  reviewedBy: project.reviewedBy ? String(project.reviewedBy) : null,
});

export const toAdminCheckpoint = (checkpoint: Checkpoint) => ({
  ...toParticipantCheckpoint(checkpoint),
  reviewNote: checkpoint.reviewNote,
  reviewedBy: checkpoint.reviewedBy ? String(checkpoint.reviewedBy) : null,
});

type TeamMember = {
  id: string;
  name: string;
  role: string;
  checkedIn: boolean;
};

export const toParticipantTeam = (team: TeamRecord, members: TeamMember[]) => ({
  id: String(team._id),
  name: team.name,
  world: team.world,
  categories: team.categories,
  room: team.room,
  bedsheetsIssued: team.bedsheetsIssued ?? 0,
  memberCount: members.length,
  members,
  project: toParticipantProject(projectOf(team)),
  checkpoints: checkpointsOf(team).map(toParticipantCheckpoint),
});

const loadTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  const members = await ParticipantModel.find({ teamId })
    .select("name role checkedIn")
    .sort({ role: 1, name: 1 })
    .lean();

  return members.map((member) => ({
    id: String(member._id),
    name: member.name,
    role: member.role,
    checkedIn: member.checkedIn,
  }));
};

export const getTeamForParticipant = async (teamId: string) => {
  const [team, members] = await Promise.all([
    TeamModel.findById(teamId).lean(),
    loadTeamMembers(teamId),
  ]);

  if (!team) throw teamNotFound();

  return toParticipantTeam(team, members);
};

const requireWorld = (team: TeamRecord): TeamWorld => {
  if (team.world !== "SOFTWARE" && team.world !== "HARDWARE") {
    throw new ApiError(
      409,
      "Your team has no world set yet; ask an organiser to fix it",
      ERROR_CODES.TEAM_WORLD_NOT_SET,
    );
  }

  return team.world;
};

const requireOpenWindow = (
  window: SubmissionWindow,
  label: string,
  now: Date,
) => {
  const grace = graceSeconds();
  const state = windowState(window, now, grace);

  if (state === "open") return;

  throw new ApiError(
    403,
    state === "upcoming"
      ? `${label} has not opened yet`
      : `${label} has closed`,
    ERROR_CODES.WINDOW_CLOSED,
    {
      open: window.open.toISOString(),
      close: window.close.toISOString(),
      graceSeconds: grace,
      state,
    },
  );
};

const allowedMimeTypes: readonly string[] = IMAGE_MIME_TYPES;

const requireImage = (image: SubmissionImage): Buffer => {
  if (!image) {
    throw new ApiError(
      400,
      `Attach the image as the "${IMAGE_FIELD_NAME}" field`,
      ERROR_CODES.VALIDATION_ERROR,
    );
  }

  const sniffed = detectImageMimeType(image.buffer);

  if (!sniffed || !allowedMimeTypes.includes(sniffed)) {
    throw new ApiError(
      400,
      `${IMAGE_FIELD_NAME} must be a JPEG, PNG or WebP image`,
      ERROR_CODES.VALIDATION_ERROR,
    );
  }

  return image.buffer;
};

type ProjectFields = {
  tracks: string[];
  description: string;
  repoUrl: string | null;
  imageUrl: string | null;
  submittedAt: Date;
  autoStatus: Project["autoStatus"];
  autoNotes: string[];
};

const saveProject = async (teamId: string, fields: ProjectFields) => {
  const result = await TeamModel.updateOne(
    { _id: teamId },
    {
      $set: {
        "project.tracks": fields.tracks,
        "project.description": fields.description,
        "project.repoUrl": fields.repoUrl,
        "project.imageUrl": fields.imageUrl,
        "project.submittedAt": fields.submittedAt,
        "project.autoStatus": fields.autoStatus,
        "project.autoFlags": [],
        "project.autoNotes": fields.autoNotes,
      },
    },
    { runValidators: true },
  );

  if (result.matchedCount === 0) throw teamNotFound();
};

const saveProjectResult = async (
  teamId: string,
  submittedAt: Date,
  result: CheckResult,
) => {
  await TeamModel.updateOne(
    { _id: teamId, "project.submittedAt": submittedAt },
    {
      $set: {
        "project.autoStatus": result.autoStatus,
        "project.autoFlags": result.autoFlags,
        "project.autoNotes": result.autoNotes,
      },
    },
  );
};

type CheckpointFields = {
  url: string;
  commitSha: string | null;
  submittedAt: Date;
  autoStatus: Checkpoint["autoStatus"];
  autoNotes: string[];
};

const checkpointSet = (fields: CheckpointFields) => ({
  "checkpoints.$.url": fields.url,
  "checkpoints.$.commitSha": fields.commitSha,
  "checkpoints.$.submittedAt": fields.submittedAt,
  "checkpoints.$.autoStatus": fields.autoStatus,
  "checkpoints.$.autoFlags": [],
  "checkpoints.$.autoNotes": fields.autoNotes,
});

const saveCheckpoint = async (
  teamId: string,
  round: CheckpointRound,
  fields: CheckpointFields,
) => {
  const written = await TeamModel.updateOne(
    { _id: teamId, "checkpoints.round": round },
    { $set: checkpointSet(fields) },
  );

  if (written.matchedCount > 0) return;

  // A team imported before the slots existed: add the missing round under a
  // filter that only matches while it is missing, then write into it.
  await TeamModel.updateOne(
    { _id: teamId, "checkpoints.round": { $ne: round } },
    { $push: { checkpoints: emptyCheckpoint(round) } },
  );

  const retried = await TeamModel.updateOne(
    { _id: teamId, "checkpoints.round": round },
    { $set: checkpointSet(fields) },
  );

  if (retried.matchedCount === 0) throw teamNotFound();
};

const saveCheckpointResult = async (
  teamId: string,
  round: CheckpointRound,
  submittedAt: Date,
  result: CheckResult,
) => {
  await TeamModel.updateOne(
    {
      _id: teamId,
      checkpoints: { $elemMatch: { round, submittedAt } },
    },
    {
      $set: {
        "checkpoints.$.autoStatus": result.autoStatus,
        "checkpoints.$.autoFlags": result.autoFlags,
        "checkpoints.$.autoNotes": result.autoNotes,
        ...(result.commitSha === null
          ? {}
          : { "checkpoints.$.commitSha": result.commitSha }),
      },
    },
  );
};

const loadTeam = async (teamId: string) => {
  const team = await TeamModel.findById(teamId).lean();
  if (!team) throw teamNotFound();
  return team;
};

export const submitProject = async (
  teamId: string,
  body: unknown,
  image: SubmissionImage,
) => {
  const team = await loadTeam(teamId);
  const world = requireWorld(team);
  const label = "The project submission window";

  if (world === "SOFTWARE") {
    const input = parseOrThrow("body", softwareProjectBody(world), body);

    requireOpenWindow(PROJECT_WINDOW, label, new Date());

    const submittedAt = new Date();

    await saveProject(teamId, {
      tracks: input.tracks,
      description: input.description,
      repoUrl: input.repoUrl,
      imageUrl: null,
      submittedAt,
      autoStatus: "PENDING_CHECK",
      autoNotes: [],
    });

    const result = await checkProjectRepo(input.repoUrl, env.EVENT_START);

    console.info(
      `Project check for ${team.unstopId}: ${result.autoStatus} ` +
        `flags=${result.autoFlags.length} notes=${result.autoNotes.length}`,
    );

    await saveProjectResult(teamId, submittedAt, result);
  } else {
    const input = parseOrThrow("body", hardwareProjectBody(world), body);
    const buffer = requireImage(image);

    requireOpenWindow(PROJECT_WINDOW, label, new Date());

    const imageUrl = await uploadSubmissionImage({
      unstopId: team.unstopId,
      publicId: PROJECT_PUBLIC_ID,
      buffer,
    });

    await saveProject(teamId, {
      tracks: input.tracks,
      description: input.description,
      repoUrl: null,
      imageUrl,
      submittedAt: new Date(),
      autoStatus: "VERIFIED",
      autoNotes: [IMAGE_REVIEWED_NOTE],
    });
  }

  return { team: await getTeamForParticipant(teamId) };
};

export const submitCheckpoint = async (
  teamId: string,
  round: CheckpointRound,
  body: unknown,
  image: SubmissionImage,
) => {
  const team = await loadTeam(teamId);
  const world = requireWorld(team);
  const window = CHECKPOINT_WINDOWS[round];
  const label = `The round ${round} window`;

  if (world === "SOFTWARE") {
    const input = parseOrThrow("body", softwareCheckpointBody, body);

    requireOpenWindow(window, label, new Date());

    const project = projectOf(team);

    if (!project.repoUrl || !project.submittedAt) {
      throw new ApiError(
        409,
        "Submit your project repository before a checkpoint",
        ERROR_CODES.PROJECT_NOT_SUBMITTED,
      );
    }

    const submittedAt = new Date();

    await saveCheckpoint(teamId, round, {
      url: input.commitUrl,
      commitSha: parseCommitUrl(input.commitUrl)?.sha ?? null,
      submittedAt,
      autoStatus: "PENDING_CHECK",
      autoNotes: [],
    });

    const usedShas = checkpointsOf(team)
      .filter((entry) => entry.round !== round && entry.commitSha !== null)
      .map((entry) => ({ round: entry.round, commitSha: entry.commitSha! }));

    const result = await checkCommit({
      commitUrl: input.commitUrl,
      projectRepoUrl: project.repoUrl,
      window,
      graceSeconds: graceSeconds(),
      usedShas,
    });

    console.info(
      `Checkpoint ${round} check for ${team.unstopId}: ${result.autoStatus} ` +
        `flags=${result.autoFlags.length} notes=${result.autoNotes.length}`,
    );

    await saveCheckpointResult(teamId, round, submittedAt, result);
  } else {
    parseOrThrow("body", hardwareCheckpointBody, body);
    const buffer = requireImage(image);

    requireOpenWindow(window, label, new Date());

    const url = await uploadSubmissionImage({
      unstopId: team.unstopId,
      publicId: `${CHECKPOINT_PUBLIC_ID_PREFIX}${round}`,
      buffer,
    });

    await saveCheckpoint(teamId, round, {
      url,
      commitSha: null,
      submittedAt: new Date(),
      autoStatus: "VERIFIED",
      autoNotes: [IMAGE_REVIEWED_NOTE],
    });
  }

  return { team: await getTeamForParticipant(teamId) };
};

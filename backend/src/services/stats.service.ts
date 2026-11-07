import type { PipelineStage } from "mongoose";

import {
  CHECKPOINT_AUTO_STATUSES,
  CHECKPOINT_REVIEW_STATUSES,
  CHECKPOINT_ROUNDS,
  TEAM_WORLDS,
} from "../config/constants";
import type {
  CheckpointAutoStatus,
  CheckpointReviewStatus,
  TeamWorld,
} from "../config/constants";
import { MEAL_SLOTS } from "../config/event";
import { ParticipantModel } from "../models/participant.model";
import { RoomModel } from "../models/room.model";
import { TeamModel } from "../models/team.model";

type Counted = { _id: unknown; count: number };
type WorldCount = { _id: TeamWorld | null; count: number; present: number };
type StatusCount = { _id: CheckpointAutoStatus | null; count: number };
type ReviewCount = { _id: CheckpointReviewStatus | null; count: number };
type RoundCount = {
  _id: { round: number; status: CheckpointAutoStatus | null };
  count: number;
};
type RoundReviewCount = {
  _id: { round: number; status: CheckpointReviewStatus | null };
  count: number;
};

type PeopleFacets = {
  total: Counted[];
  present: Counted[];
  byWorld: WorldCount[];
  meals: Counted[];
  presentWithoutRoom: Counted[];
};

type TeamFacets = {
  total: Counted[];
  bedsheets: { _id: null; total: number }[];
  byWorld: Counted[];
  withoutWorld: Counted[];
  projectStatus: StatusCount[];
  projectReview: ReviewCount[];
  checkpointStatus: RoundCount[];
  checkpointReview: RoundReviewCount[];
  checkFailed: Counted[];
  unreviewedSuspicious: Counted[];
};

type RoomFacets = {
  totals: { _id: null; capacity: number; available: number }[];
  byRoom: {
    _id: string;
    capacity: number;
    available: number;
    hardware: boolean;
    teams: number;
  }[];
};

const count = (rows: Counted[]) => rows[0]?.count ?? 0;

const toMap = <T extends { _id: unknown; count: number }>(rows: T[]) =>
  new Map(rows.map((row) => [String(row._id), row.count]));

const anySubmission = (status: CheckpointAutoStatus) => ({
  $or: [
    { "project.autoStatus": status },
    { checkpoints: { $elemMatch: { autoStatus: status } } },
  ],
});

const unreviewedSuspicious = {
  $or: [
    { "project.autoStatus": "SUSPICIOUS", "project.reviewStatus": null },
    {
      checkpoints: {
        $elemMatch: { autoStatus: "SUSPICIOUS", reviewStatus: null },
      },
    },
  ],
};

const peoplePipeline: PipelineStage[] = [
  {
    $lookup: {
      from: "teams",
      localField: "teamId",
      foreignField: "_id",
      as: "team",
    },
  },
  { $set: { team: { $first: "$team" } } },
  {
    $facet: {
      total: [{ $count: "count" }],
      present: [{ $match: { checkedIn: true } }, { $count: "count" }],
      byWorld: [
        {
          $group: {
            _id: "$team.world",
            count: { $sum: 1 },
            present: { $sum: { $cond: ["$checkedIn", 1, 0] } },
          },
        },
      ],
      meals: [
        { $unwind: "$mealsTaken" },
        { $group: { _id: "$mealsTaken", count: { $sum: 1 } } },
      ],
      presentWithoutRoom: [
        { $match: { checkedIn: true, "team.room": null } },
        { $group: { _id: "$teamId" } },
        { $count: "count" },
      ],
    },
  },
];

const teamPipeline: PipelineStage[] = [
  {
    $facet: {
      total: [{ $count: "count" }],
      bedsheets: [
        {
          $group: {
            _id: null,
            total: { $sum: { $ifNull: ["$bedsheetsIssued", 0] } },
          },
        },
      ],
      byWorld: [{ $group: { _id: "$world", count: { $sum: 1 } } }],
      withoutWorld: [
        { $match: { world: { $nin: TEAM_WORLDS } } },
        { $count: "count" },
      ],
      projectStatus: [
        { $group: { _id: "$project.autoStatus", count: { $sum: 1 } } },
      ],
      projectReview: [
        { $group: { _id: "$project.reviewStatus", count: { $sum: 1 } } },
      ],
      checkpointStatus: [
        { $unwind: "$checkpoints" },
        {
          $group: {
            _id: {
              round: "$checkpoints.round",
              status: "$checkpoints.autoStatus",
            },
            count: { $sum: 1 },
          },
        },
      ],
      checkpointReview: [
        { $unwind: "$checkpoints" },
        {
          $group: {
            _id: {
              round: "$checkpoints.round",
              status: "$checkpoints.reviewStatus",
            },
            count: { $sum: 1 },
          },
        },
      ],
      checkFailed: [
        { $match: anySubmission("CHECK_FAILED") },
        { $count: "count" },
      ],
      unreviewedSuspicious: [
        { $match: unreviewedSuspicious },
        { $count: "count" },
      ],
    },
  },
];

const roomPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: "teams",
      localField: "number",
      foreignField: "room",
      as: "teams",
    },
  },
  { $sort: { number: 1 } },
  {
    $facet: {
      totals: [
        {
          $group: {
            _id: null,
            capacity: { $sum: "$capacity" },
            available: { $sum: "$available" },
          },
        },
      ],
      byRoom: [
        {
          $project: {
            _id: "$number",
            capacity: 1,
            available: 1,
            hardware: 1,
            teams: { $size: "$teams" },
          },
        },
      ],
    },
  },
];

const perStatus = (
  lookup: Map<string, number>,
  prefix: string,
  statuses: readonly string[],
) =>
  Object.fromEntries(
    statuses.map((status) => [status, lookup.get(`${prefix}${status}`) ?? 0]),
  );

const reviewTally = (lookup: Map<string, number>, prefix = "") => ({
  ...perStatus(lookup, prefix, CHECKPOINT_REVIEW_STATUSES),
  NONE: lookup.get(`${prefix}null`) ?? 0,
});

export const getStats = async () => {
  const [people, teams, rooms] = await Promise.all([
    ParticipantModel.aggregate<PeopleFacets>(peoplePipeline),
    TeamModel.aggregate<TeamFacets>(teamPipeline),
    RoomModel.aggregate<RoomFacets>(roomPipeline),
  ]);

  const peopleFacets = people[0];
  const teamFacets = teams[0];
  const roomFacets = rooms[0];

  if (!peopleFacets || !teamFacets || !roomFacets) {
    throw new Error("A stats aggregation returned no facets");
  }

  const mealsServed = toMap(peopleFacets.meals);
  const teamsByWorld = toMap(teamFacets.byWorld);
  const projectStatus = toMap(teamFacets.projectStatus);
  const projectReview = toMap(teamFacets.projectReview);

  const roundStatus = new Map<string, number>(
    teamFacets.checkpointStatus.map((row) => [
      `${row._id.round}:${row._id.status}`,
      row.count,
    ]),
  );
  const roundReview = new Map<string, number>(
    teamFacets.checkpointReview.map((row) => [
      `${row._id.round}:${row._id.status}`,
      row.count,
    ]),
  );

  const peopleByWorld = new Map(
    peopleFacets.byWorld.map((row) => [
      String(row._id),
      { total: row.count, checkedIn: row.present },
    ]),
  );

  return {
    participants: {
      total: count(peopleFacets.total),
      checkedIn: count(peopleFacets.present),
      byWorld: TEAM_WORLDS.map((world) => ({
        world,
        total: peopleByWorld.get(world)?.total ?? 0,
        checkedIn: peopleByWorld.get(world)?.checkedIn ?? 0,
      })),
    },
    teams: {
      total: count(teamFacets.total),
      byWorld: TEAM_WORLDS.map((world) => ({
        world,
        total: teamsByWorld.get(world) ?? 0,
      })),
    },
    meals: MEAL_SLOTS.map((slot) => ({
      id: slot.id,
      label: slot.label,
      served: mealsServed.get(slot.id) ?? 0,
    })),
    bedsheetsIssued: teamFacets.bedsheets[0]?.total ?? 0,
    rooms: {
      capacity: roomFacets.totals[0]?.capacity ?? 0,
      available: roomFacets.totals[0]?.available ?? 0,
      list: roomFacets.byRoom.map((room) => ({
        number: room._id,
        capacity: room.capacity,
        available: room.available,
        hardware: room.hardware,
        teams: room.teams,
      })),
    },
    submissions: {
      project: {
        autoStatus: perStatus(projectStatus, "", CHECKPOINT_AUTO_STATUSES),
        reviewStatus: reviewTally(projectReview),
      },
      checkpoints: CHECKPOINT_ROUNDS.map((round) => ({
        round,
        autoStatus: perStatus(
          roundStatus,
          `${round}:`,
          CHECKPOINT_AUTO_STATUSES,
        ),
        reviewStatus: reviewTally(roundReview, `${round}:`),
      })),
    },
    actionItems: {
      teamsWithoutWorld: count(teamFacets.withoutWorld),
      checkedInTeamsWithoutRoom: count(peopleFacets.presentWithoutRoom),
      teamsWithCheckFailed: count(teamFacets.checkFailed),
      teamsWithUnreviewedSuspicious: count(teamFacets.unreviewedSuspicious),
    },
  };
};

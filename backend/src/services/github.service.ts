import axios from "axios";
import type { AxiosInstance } from "axios";

import {
  CHECKPOINT_CODE_DUMP_LINES,
  CHECKPOINT_GENERIC_MESSAGE_LINES,
  CHECKPOINT_MAX_BINARY_SHARE,
  CHECKPOINT_MAX_CHANGED_LINES,
  COMMIT_URL_PATTERN,
  GENERIC_COMMIT_MESSAGES,
  GITHUB_ACTIVITY_PAGE_SIZE,
  GITHUB_API_ACCEPT,
  GITHUB_API_BASE_URL,
  GITHUB_API_VERSION,
  GITHUB_TIMEOUT_MS,
  PROJECT_MAX_EARLY_COMMITS,
  PROJECT_MAX_REPO_SIZE_KB,
  REPO_URL_PATTERN,
} from "../config/constants";
import { env } from "../config/env";
import { logger } from "../config/logger";
import type { SubmissionWindow } from "../config/event";
import { effectiveClose } from "../config/event";
import type { SubmissionResult } from "../models/team.model";

export type RepoRef = { owner: string; repo: string };
export type CommitRef = RepoRef & { sha: string };

export type CheckResult = SubmissionResult & { commitSha: string | null };

type Fetched<T> =
  | { ok: true; data: T }
  | { ok: false; status: number | null; remaining: string | null };

export type RepoResponse = {
  created_at: string;
  size: number;
  private: boolean;
  full_name: string;
};

export type CommitFile = { patch?: string; status?: string };

export type CommitResponse = {
  sha: string;
  commit: { message: string; committer?: { date?: string } };
  stats?: { total?: number };
  files?: CommitFile[];
};

type ActivityResponse = { after?: string; timestamp?: string }[];

const client: AxiosInstance = axios.create({
  baseURL: GITHUB_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: GITHUB_API_ACCEPT,
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
  },
  timeout: GITHUB_TIMEOUT_MS,
});

const header = (value: unknown) =>
  typeof value === "string"
    ? value
    : value === undefined
      ? null
      : String(value);

const get = async <T>(
  path: string,
  params?: Record<string, string | number>,
): Promise<Fetched<T>> => {
  const startedAt = Date.now();

  try {
    const response = await client.get<T>(path, { params });
    logger.debug(
      { path, status: response.status, durationMs: Date.now() - startedAt },
      "github call",
    );

    return { ok: true, data: response.data };
  } catch (error) {
    const status = axios.isAxiosError(error)
      ? (error.response?.status ?? null)
      : null;
    const remaining = axios.isAxiosError(error)
      ? header(error.response?.headers?.["x-ratelimit-remaining"])
      : null;

    if (
      status === null ||
      status >= 500 ||
      status === 429 ||
      status === 403 ||
      status === 401
    ) {
      logger.warn(
        {
          path,
          status,
          rateLimitRemaining: remaining,
          durationMs: Date.now() - startedAt,
        },
        "github call failed",
      );
    }

    return { ok: false, status, remaining };
  }
};

export const parseRepoUrl = (url: string): RepoRef | null => {
  const match = REPO_URL_PATTERN.exec(url.trim());
  if (!match) return null;
  return { owner: match[1]!, repo: match[2]! };
};

export const parseCommitUrl = (url: string): CommitRef | null => {
  const match = COMMIT_URL_PATTERN.exec(url.trim());
  if (!match) return null;
  return { owner: match[1]!, repo: match[2]!, sha: match[3]! };
};

export const sameRepo = (a: RepoRef, b: RepoRef) =>
  a.owner.toLowerCase() === b.owner.toLowerCase() &&
  a.repo.toLowerCase() === b.repo.toLowerCase();

export const shaMatches = (a: string | null, b: string | null) => {
  if (!a || !b) return false;
  const length = Math.min(a.length, b.length);
  if (length < 7) return false;
  return a.slice(0, length).toLowerCase() === b.slice(0, length).toLowerCase();
};

const COMMIT_NOT_FOUND_STATUS = 422;

export const failed = (commitSha: string | null = null): CheckResult => ({
  autoStatus: "CHECK_FAILED",
  autoFlags: [],
  autoNotes: ["The automatic check could not be completed"],
  commitSha,
});

const decide = (
  flags: string[],
  notes: string[],
  commitSha: string | null = null,
): CheckResult => ({
  autoStatus: flags.length > 0 ? "SUSPICIOUS" : "VERIFIED",
  autoFlags: flags,
  autoNotes: notes,
  commitSha,
});

export const notARepoUrl = (): CheckResult => ({
  autoStatus: "SUSPICIOUS",
  autoFlags: ["Not a GitHub repository URL"],
  autoNotes: [],
  commitSha: null,
});

export const repoNotFound = (): CheckResult => ({
  autoStatus: "SUSPICIOUS",
  autoFlags: ["Repo not found or private"],
  autoNotes: [],
  commitSha: null,
});

export const judgeProjectRepo = (
  repo: RepoResponse,
  commitCount: number,
  eventStart: Date,
): CheckResult => {
  const flags: string[] = [];
  const notes: string[] = [];

  if (repo.private) {
    flags.push("Repo not found or private");
  }

  const createdAt = new Date(repo.created_at);

  if (!Number.isNaN(createdAt.getTime()) && createdAt < eventStart) {
    flags.push(
      `Repo was created before the event started (${repo.created_at})`,
    );
  }

  if (repo.size > PROJECT_MAX_REPO_SIZE_KB) {
    notes.push(
      `Repo is ${repo.size} KB, over the ` +
        `${PROJECT_MAX_REPO_SIZE_KB} KB expected for a new project`,
    );
  }

  if (commitCount > PROJECT_MAX_EARLY_COMMITS) {
    notes.push(
      `Repo already had more than ${PROJECT_MAX_EARLY_COMMITS} commits at ` +
        "submission",
    );
  }

  return decide(flags, notes);
};

export const checkProjectRepo = async (
  repoUrl: string,
  eventStart: Date,
): Promise<CheckResult> => {
  const ref = parseRepoUrl(repoUrl);

  if (!ref) return notARepoUrl();

  const repo = await get<RepoResponse>(`/repos/${ref.owner}/${ref.repo}`);

  if (!repo.ok) {
    if (repo.status === 404) return repoNotFound();
    return failed();
  }

  const commits = await get<unknown[]>(
    `/repos/${ref.owner}/${ref.repo}/commits`,
    { per_page: PROJECT_MAX_EARLY_COMMITS + 1 },
  );

  if (!commits.ok && commits.status !== 409) {
    return failed();
  }

  return judgeProjectRepo(
    repo.data,
    commits.ok ? commits.data.length : 0,
    eventStart,
  );
};

const pushTime = async (ref: CommitRef): Promise<Date | null> => {
  const activity = await get<ActivityResponse>(
    `/repos/${ref.owner}/${ref.repo}/activity`,
    { per_page: GITHUB_ACTIVITY_PAGE_SIZE },
  );

  if (!activity.ok) return null;

  for (const item of activity.data) {
    if (!shaMatches(item.after ?? null, ref.sha)) continue;
    if (!item.timestamp) continue;

    const timestamp = new Date(item.timestamp);
    if (!Number.isNaN(timestamp.getTime())) return timestamp;
  }

  return null;
};

const isGenericMessage = (message: string) => {
  const firstLine = (message.split("\n")[0] ?? "")
    .trim()
    .toLowerCase()
    .replace(/[.!\s]+$/, "");

  return GENERIC_COMMIT_MESSAGES.some((generic) => generic === firstLine);
};

export type CheckCommitInput = {
  commitUrl: string;
  projectRepoUrl: string | null;
  window: SubmissionWindow;
  graceSeconds: number;
  usedShas: { round: number; commitSha: string }[];
};

export const notACommitUrl = (): CheckResult => ({
  autoStatus: "SUSPICIOUS",
  autoFlags: ["Not a GitHub commit URL"],
  autoNotes: [],
  commitSha: null,
});

export const commitPreflightFlags = (
  ref: CommitRef,
  projectRepoUrl: string | null,
  usedShas: { round: number; commitSha: string }[],
): string[] => {
  const flags: string[] = [];
  const projectRef = projectRepoUrl ? parseRepoUrl(projectRepoUrl) : null;

  if (!projectRef || !sameRepo(ref, projectRef)) {
    flags.push("Commit is not from the team's project repo");
  }

  for (const used of usedShas) {
    if (shaMatches(used.commitSha, ref.sha)) {
      flags.push(`Same commit as round ${used.round}`);
    }
  }

  return flags;
};

export type JudgeCommitInput = {
  commit: CommitResponse;
  fallbackSha: string;
  pushedAt: Date | null;
  preflight: string[];
  window: SubmissionWindow;
  graceSeconds: number;
};

export const judgeCommit = (input: JudgeCommitInput): CheckResult => {
  const flags = [...input.preflight];
  const notes: string[] = [];

  const fullSha = input.commit.sha || input.fallbackSha;

  const committedAt = input.commit.commit.committer?.date
    ? new Date(input.commit.commit.committer.date)
    : null;

  if (!input.pushedAt) {
    notes.push("Window checked against the commit date (no push record)");
  }

  const when =
    input.pushedAt ??
    (committedAt && !Number.isNaN(committedAt.getTime()) ? committedAt : null);

  if (!when) {
    notes.push("The commit carries no usable timestamp");
  } else if (
    when < input.window.open ||
    when > effectiveClose(input.window, input.graceSeconds)
  ) {
    flags.push(
      `Commit time is outside the round's window (${when.toISOString()})`,
    );
  }

  const changedLines = input.commit.stats?.total ?? 0;

  if (changedLines > CHECKPOINT_CODE_DUMP_LINES) {
    notes.push(`${changedLines} changed lines: likely a code dump`);
  } else if (changedLines > CHECKPOINT_MAX_CHANGED_LINES) {
    notes.push(
      `${changedLines} changed lines, over the ` +
        `${CHECKPOINT_MAX_CHANGED_LINES} expected for one round`,
    );
  }

  const files = input.commit.files ?? [];
  const binary = files.filter((file) => file.patch === undefined).length;

  if (files.length > 0 && binary / files.length > CHECKPOINT_MAX_BINARY_SHARE) {
    notes.push(
      `${binary} of ${files.length} changed files are binary or assets`,
    );
  }

  if (
    isGenericMessage(input.commit.commit.message) &&
    changedLines > CHECKPOINT_GENERIC_MESSAGE_LINES
  ) {
    notes.push(`Generic commit message on a ${changedLines}-line change`);
  }

  return decide(flags, notes, fullSha);
};

export const checkCommit = async (
  input: CheckCommitInput,
): Promise<CheckResult> => {
  const ref = parseCommitUrl(input.commitUrl);

  if (!ref) return notACommitUrl();

  const preflight = commitPreflightFlags(
    ref,
    input.projectRepoUrl,
    input.usedShas,
  );

  const commit = await get<CommitResponse>(
    `/repos/${ref.owner}/${ref.repo}/commits/${ref.sha}`,
  );

  if (!commit.ok) {
    if (commit.status === 404 || commit.status === COMMIT_NOT_FOUND_STATUS) {
      return decide([...preflight, "Repo or commit not found"], [], ref.sha);
    }

    if (preflight.length > 0) {
      return decide(preflight, [], ref.sha);
    }

    return failed(ref.sha);
  }

  const fullSha = commit.data.sha || ref.sha;

  return judgeCommit({
    commit: commit.data,
    fallbackSha: ref.sha,
    pushedAt: await pushTime({ ...ref, sha: fullSha }),
    preflight,
    window: input.window,
    graceSeconds: input.graceSeconds,
  });
};

import type { TeamCategory } from "./constants";

export const UNSTOP_FLAG_FIELDS = [
  "fresherFlag",
  "wieFlag",
  "ieeeFlag",
] as const;

export type UnstopFlagField = (typeof UNSTOP_FLAG_FIELDS)[number];

export type UnstopField =
  | "teamId"
  | "teamName"
  | "name"
  | "email"
  | "phone"
  | "college"
  | "role"
  | UnstopFlagField;

export const UNSTOP_COLUMNS: Record<
  UnstopField,
  { headers: string[]; required: boolean }
> = {
  teamId: { headers: ["team_id", "Team Id", "Team ID"], required: true },
  teamName: { headers: ["team_name", "Team Name"], required: true },
  name: {
    headers: ["participant_name", "Candidate's Name", "Name"],
    required: true,
  },
  email: { headers: ["Candidate's Email", "Email"], required: true },
  phone: {
    headers: ["mobile_number", "Candidate's Mobile", "Mobile"],
    required: true,
  },
  college: {
    headers: ["Candidate's Organisation", "College Name"],
    required: false,
  },
  role: {
    headers: ["Candidate role", "Role", "User Type"],
    required: true,
  },
  fresherFlag: { headers: ["is_eligible_fresher_team"], required: false },
  wieFlag: { headers: ["is_eligible_wie_team"], required: false },
  ieeeFlag: { headers: ["is_eligible_ieee_team"], required: false },
};

export const UNSTOP_ROLE_VALUES: Record<string, "LEADER" | "MEMBER"> = {
  "team leader": "LEADER",
  leader: "LEADER",
  lead: "LEADER",
  "team member": "MEMBER",
  member: "MEMBER",
  mem: "MEMBER",
};

export const UNSTOP_FLAG_TRUE_VALUES = ["true", "yes", "1"] as const;
export const UNSTOP_FLAG_FALSE_VALUES = ["false", "no", "0"] as const;

export const UNSTOP_FLAG_CATEGORIES: Record<UnstopFlagField, TeamCategory> = {
  fresherFlag: "FRESHERS",
  wieFlag: "WOMEN",
  ieeeFlag: "IEEE",
};

export type TeamSheetField = "teamId" | "teamName" | "categories";

export const TEAM_SHEET_COLUMNS: Record<
  TeamSheetField,
  { headers: string[]; required: boolean }
> = {
  teamId: { headers: ["Team ID", "Team Id"], required: true },
  teamName: { headers: ["Team Name"], required: false },
  categories: { headers: ["Categories", "Category"], required: true },
};

export const TEAM_SHEET_CATEGORY_VALUES: Record<
  string,
  "WOMEN" | "FRESHERS" | "IEEE"
> = {
  women: "WOMEN",
  woman: "WOMEN",
  freshers: "FRESHERS",
  fresher: "FRESHERS",
  ieee: "IEEE",
};

export type UnstopField =
  "teamId" | "teamName" | "name" | "email" | "phone" | "college" | "role";

export const UNSTOP_COLUMNS: Record<
  UnstopField,
  { headers: string[]; required: boolean }
> = {
  teamId: { headers: ["Team Id", "Team ID"], required: true },
  teamName: { headers: ["Team Name"], required: true },
  name: { headers: ["Candidate's Name", "Name"], required: true },
  email: { headers: ["Candidate's Email", "Email"], required: true },
  phone: { headers: ["Candidate's Mobile", "Mobile"], required: false },
  college: {
    headers: ["Candidate's Organisation", "College Name"],
    required: true,
  },
  role: {
    headers: ["Candidate role", "Role", "User Type"],
    required: true,
  },
};

export const UNSTOP_ROLE_VALUES: Record<string, "LEADER" | "MEMBER"> = {
  "team leader": "LEADER",
  leader: "LEADER",
  lead: "LEADER",
  "team member": "MEMBER",
  member: "MEMBER",
  mem: "MEMBER",
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

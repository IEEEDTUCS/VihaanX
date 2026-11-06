import type { AdminRole, ParticipantRole, AuthRole } from "../config/constants";

export type AdminAuth = {
  id: string;
  kind: "admin";
  role: AdminRole;
};

export type ParticipantAuth = {
  id: string;
  kind: "participant";
  role: ParticipantRole;
  teamId: string;
};

export type RequestAuth = AdminAuth | ParticipantAuth;

export type RequestValidated = {
  params?: unknown;
  query?: unknown;
  body?: unknown;
};

declare global {
  namespace Express {
    interface Request {
      auth?: RequestAuth;
      validated?: RequestValidated;
    }
  }
}

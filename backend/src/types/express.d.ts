import type { AdminRole, AuthKind } from "../config/constants";

export type RequestAuth = {
  id: string;
  kind: AuthKind;
  role: AdminRole;
  teamId?: string;
};

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

import { randomUUID } from "node:crypto";

import { pinoHttp } from "pino-http";

import {
  API_PREFIX,
  REQUEST_ID_HEADER,
  REQUEST_ID_PATTERN,
} from "../config/constants";
import { logger } from "../config/logger";

const HEALTH_ROUTE = `${API_PREFIX}/health`;

const firstHeader = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const routeOf = (req: { logPrefix?: string; route?: { path?: string } }) => {
  if (req.logPrefix === undefined) return "(unmatched)";

  const path = req.route?.path;
  const tail = path === undefined || path === "/" ? "" : path;

  return `${API_PREFIX}${req.logPrefix}${tail}`;
};

export const requestLogger = pinoHttp({
  logger,

  genReqId: (req, res) => {
    const incoming = firstHeader(req.headers[REQUEST_ID_HEADER]);
    const id =
      incoming !== undefined && REQUEST_ID_PATTERN.test(incoming)
        ? incoming
        : randomUUID();

    res.setHeader(REQUEST_ID_HEADER, id);

    return id;
  },

  customLogLevel: (req, res, error) => {
    if (error !== undefined || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";

    if (req.method === "GET" && routeOf(req as never) === HEALTH_ROUTE) {
      return "debug";
    }

    return "info";
  },

  customSuccessMessage: () => "request",
  customErrorMessage: () => "request",

  customProps: (req, res) => {
    if (!res.writableEnded) return {};

    const auth = (req as { auth?: { kind: string; role: string; id: string } })
      .auth;

    return {
      requestId: req.id,
      route: routeOf(req as never),
      ...(auth
        ? { callerKind: auth.kind, callerRole: auth.role, callerId: auth.id }
        : {}),
    };
  },

  serializers: {
    req: (req: { method?: string }) => ({ method: req.method }),
    res: (res: { statusCode?: number }) => ({ status: res.statusCode }),
  },
});

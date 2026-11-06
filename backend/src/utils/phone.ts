import { PHONE_COUNTRY_CODE } from "../config/constants";

export const normalisePhone = (raw: string): string | null => {
  const compact = raw.replace(/[\s()-]/g, "");
  if (compact.length === 0) return null;

  const match = /^(?:\+91|91|0)?([6-9]\d{9})$/.exec(compact);
  if (!match) return null;

  return `${PHONE_COUNTRY_CODE}${match[1]}`;
};

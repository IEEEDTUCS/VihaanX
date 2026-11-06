import { randomInt } from "node:crypto";

import { RSVP_CODE_ALPHABET, RSVP_CODE_LENGTH } from "../config/constants";

export const generateRsvpCode = () => {
  let code = "";
  for (let index = 0; index < RSVP_CODE_LENGTH; index += 1) {
    code += RSVP_CODE_ALPHABET[randomInt(RSVP_CODE_ALPHABET.length)];
  }
  return code;
};

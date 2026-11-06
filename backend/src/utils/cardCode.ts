import { randomInt } from "node:crypto";

import { CARD_CODE_LENGTH } from "../config/constants";

export const generateCardCode = () => {
  let code = String(randomInt(1, 10));
  for (let index = 1; index < CARD_CODE_LENGTH; index += 1) {
    code += String(randomInt(10));
  }
  return code;
};

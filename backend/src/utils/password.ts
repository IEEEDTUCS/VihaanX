import bcrypt from "bcrypt";

import { BCRYPT_COST } from "../config/constants";

export const hashPassword = async (password: string) =>
  bcrypt.hash(password, BCRYPT_COST);

export const verifyPassword = async (password: string, hash: string) =>
  bcrypt.compare(password, hash);

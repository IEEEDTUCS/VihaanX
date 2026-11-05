import readline from "node:readline/promises";

import { connectDatabase, disconnectDatabase } from "../config/database";
import { passwordSchema, usernameSchema } from "../schemas/admin.schema";
import { createAdmin } from "../services/admin.service";
import { ApiError } from "../utils/ApiError";
import { confirmTarget } from "./confirmTarget";

const askVisible = async (question: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
};

const askHidden = async (question: string) => {
  if (!process.stdin.isTTY) {
    throw new Error(
      "No terminal available to prompt for a password. " +
        "Pass it as the second argument instead.",
    );
  }

  process.stdout.write(question);

  return new Promise<string>((resolve, reject) => {
    let bytes: number[] = [];

    const dropLastCharacter = () => {
      const characters = Array.from(Buffer.from(bytes).toString("utf8"));
      characters.pop();
      bytes = [...Buffer.from(characters.join(""), "utf8")];
    };

    const onData = (chunk: Buffer) => {
      for (const byte of chunk) {
        if (byte === 0x03) {
          cleanup();
          process.stdout.write("\n");
          reject(new Error("Cancelled"));
          return;
        }
        if (byte === 0x0d || byte === 0x0a) {
          cleanup();
          process.stdout.write("\n");
          resolve(Buffer.from(bytes).toString("utf8"));
          return;
        }
        if (byte === 0x7f || byte === 0x08) {
          dropLastCharacter();
          continue;
        }
        bytes.push(byte);
      }
    };

    const cleanup = () => {
      process.stdin.off("data", onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    };

    process.stdin.resume();
    process.stdin.setRawMode(true);
    process.stdin.on("data", onData);
  });
};

const fail = (message: string) => {
  console.error(message);
  process.exitCode = 1;
};

const main = async () => {
  const args = process.argv.slice(2);
  const assumeYes = args.includes("--yes");
  const [usernameArg, passwordArg] = args.filter((arg) => arg !== "--yes");

  const rawUsername = usernameArg ?? (await askVisible("Username: "));
  const rawPassword = passwordArg ?? (await askHidden("Password: "));

  const username = usernameSchema.safeParse(rawUsername);
  if (!username.success) {
    fail(`Invalid username: ${username.error.issues[0]?.message ?? "invalid"}`);
    return;
  }

  const password = passwordSchema.safeParse(rawPassword);
  if (!password.success) {
    fail(`Invalid password: ${password.error.issues[0]?.message ?? "invalid"}`);
    return;
  }

  if (!(await confirmTarget({ assumeYes }))) {
    process.exitCode = 1;
    return;
  }

  await connectDatabase();

  try {
    const admin = await createAdmin(
      username.data,
      password.data,
      "SUPER_ADMIN",
    );
    console.log(`Created super admin "${admin.username}" (${admin.id})`);
  } catch (error) {
    if (error instanceof ApiError) {
      fail(error.message);
    } else {
      throw error;
    }
  } finally {
    await disconnectDatabase();
  }
};

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  process.exit(process.exitCode ?? 0);
}

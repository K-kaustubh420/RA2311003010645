import { LOGS_ENDPOINT } from "./config";
import type { LogLevel, LogPackage, LogStack } from "./types";

type LogFn = (
  token: string,
  stack: LogStack,
  level: LogLevel,
  pkg: LogPackage,
  message: string
) => Promise<void>;

export const Log: LogFn = async (token, stack, level, pkg, message) => {

  try {
    await fetch(LOGS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message,
      }),
    });
  } catch {
    // never throw from logger (avoid breaking UI flow)
  }
};

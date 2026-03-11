export const SESSION_COOKIE_NAME = "tlnou_session";

const maxAgeDays = Number(process.env.SESSION_MAX_AGE_DAYS ?? "30");
export const SESSION_MAX_AGE_MS = maxAgeDays * 24 * 60 * 60 * 1000;

export const RATE_LIMIT_WINDOW_MINUTES = Number(
  process.env.RATE_LIMIT_WINDOW_MINUTES ?? "15",
);
export const RATE_LIMIT_MAX_IDENTIFIER = Number(
  process.env.RATE_LIMIT_MAX_IDENTIFIER ?? "6",
);
export const RATE_LIMIT_MAX_IP = Number(process.env.RATE_LIMIT_MAX_IP ?? "20");

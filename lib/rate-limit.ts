import { getKv } from "./kv.ts";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

interface AttemptDoc {
  count: number;
  firstAt: number;
}

function attemptKey(scope: string, id: string): Deno.KvKey {
  return ["login_attempts", scope, id];
}

/** Client IP from Deploy / reverse-proxy headers, else "unknown". */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    "unknown";
}

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSeconds: number };

/** Returns whether the identity may attempt login. Does not increment. */
export async function checkLoginRateLimit(
  ip: string,
  username: string,
): Promise<RateLimitResult> {
  const kv = await getKv();
  const now = Date.now();
  const keys = [
    attemptKey("ip", ip),
    attemptKey("user", username.toLowerCase()),
  ];

  let worstRetry = 0;
  for (const key of keys) {
    const res = await kv.get<AttemptDoc>(key);
    if (!res.value) continue;
    if (now - res.value.firstAt > WINDOW_MS) continue;
    if (res.value.count >= MAX_ATTEMPTS) {
      const retry = Math.ceil(
        (res.value.firstAt + WINDOW_MS - now) / 1000,
      );
      worstRetry = Math.max(worstRetry, Math.max(retry, 1));
    }
  }

  if (worstRetry > 0) {
    return { ok: false, retryAfterSeconds: worstRetry };
  }
  return { ok: true, remaining: MAX_ATTEMPTS };
}

/** Record a failed login for both IP and username buckets. */
export async function recordLoginFailure(
  ip: string,
  username: string,
): Promise<void> {
  const kv = await getKv();
  const now = Date.now();
  for (const [scope, id] of [
    ["ip", ip],
    ["user", username.toLowerCase()],
  ] as const) {
    const key = attemptKey(scope, id);
    for (let i = 0; i < 5; i++) {
      const existing = await kv.get<AttemptDoc>(key);
      let next: AttemptDoc;
      if (!existing.value || now - existing.value.firstAt > WINDOW_MS) {
        next = { count: 1, firstAt: now };
      } else {
        next = {
          count: existing.value.count + 1,
          firstAt: existing.value.firstAt,
        };
      }
      const result = await kv.atomic()
        .check(existing)
        .set(key, next, { expireIn: WINDOW_MS })
        .commit();
      if (result.ok) break;
    }
  }
}

/** Clear rate-limit counters after a successful login. */
export async function clearLoginFailures(
  ip: string,
  username: string,
): Promise<void> {
  const kv = await getKv();
  await kv.delete(attemptKey("ip", ip));
  await kv.delete(attemptKey("user", username.toLowerCase()));
}

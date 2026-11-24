import "server-only";

/**
 * Fixed-window, in-memory limiter. Best effort: on serverless platforms each
 * instance keeps its own counters, so treat this as a speed bump for bursts,
 * not a hard guarantee. The DB unique index is the real duplicate guard.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    }
    return { ok: true, retryAfter: 0 };
  }

  entry.count += 1;
  return {
    ok: entry.count <= limit,
    retryAfter: Math.ceil((entry.resetAt - now) / 1000),
  };
}

export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

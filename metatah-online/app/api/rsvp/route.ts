import { connection } from "next/server";
import { invitationData } from "@/data/invitation";
import { toRsvpInput, validateRsvp } from "@/lib/rsvp";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";
import { RsvpConfigError, getRsvpRepository } from "@/lib/server/rsvp-repository";

const MAX_BODY_BYTES = 4 * 1024;
const POST_LIMIT = { count: 5, windowMs: 10 * 60 * 1000 };

const noStore = { "Cache-Control": "no-store" };

function error(status: number, code: string, extra?: Record<string, unknown>, headers?: HeadersInit) {
  return Response.json({ error: { code, ...extra } }, { status, headers: { ...noStore, ...headers } });
}

function serverError(err: unknown) {
  if (err instanceof RsvpConfigError) {
    console.error("[rsvp]", err.message);
    return error(503, "UNAVAILABLE");
  }
  console.error("[rsvp]", err);
  return error(500, "INTERNAL");
}

/** Browsers always send Origin on cross-site POSTs; compare it to the host served. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser client; rate limit + validation still apply
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false; // e.g. "Origin: null" from sandboxed contexts
  }
}

export async function GET() {
  await connection(); // always read fresh rows; never prerender this handler
  try {
    const wishes = await getRsvpRepository().list(invitationData.id);
    return Response.json({ data: wishes }, { headers: noStore });
  } catch (err) {
    return serverError(err);
  }
}

export async function POST(request: Request) {
  // Same-origin only: the form lives on this site.
  if (!isSameOrigin(request)) return error(403, "FORBIDDEN");

  const limited = rateLimit(`rsvp:${clientIp(request.headers)}`, POST_LIMIT.count, POST_LIMIT.windowMs);
  if (!limited.ok) {
    return error(429, "RATE_LIMITED", undefined, { "Retry-After": String(limited.retryAfter) });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return error(413, "TOO_LARGE");

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return error(400, "BAD_JSON");
  }

  const input = toRsvpInput(body);

  // Honeypot filled → almost certainly a bot. Pretend success, store nothing.
  if (input.website.trim() !== "") {
    return Response.json({ data: null }, { status: 201, headers: noStore });
  }

  const result = validateRsvp(input);
  if (!result.ok) return error(400, "VALIDATION_ERROR", { fields: result.errors });

  try {
    const created = await getRsvpRepository().create(invitationData.id, result.data);
    if (!created.ok) return error(409, "DUPLICATE");
    return Response.json({ data: created.wish }, { status: 201, headers: noStore });
  } catch (err) {
    return serverError(err);
  }
}

import type { RsvpErrors, RsvpInput, Wish } from "@/types/rsvp";

export type RsvpErrorCode = "VALIDATION_ERROR" | "DUPLICATE" | "RATE_LIMITED" | "UNAVAILABLE" | "NETWORK";

export class RsvpRequestError extends Error {
  constructor(
    public code: RsvpErrorCode,
    public fields?: RsvpErrors,
  ) {
    super(code);
  }
}

type ErrorBody = { error?: { code?: string; fields?: RsvpErrors } };

async function readError(res: Response): Promise<RsvpRequestError> {
  const body = (await res.json().catch(() => ({}))) as ErrorBody;
  const code = body.error?.code;
  if (code === "VALIDATION_ERROR" || code === "DUPLICATE" || code === "RATE_LIMITED")
    return new RsvpRequestError(code, body.error?.fields);
  return new RsvpRequestError("UNAVAILABLE");
}

export async function listWishes(signal?: AbortSignal): Promise<Wish[]> {
  const res = await fetch("/api/rsvp", { cache: "no-store", signal });
  if (!res.ok) throw await readError(res);
  const body = (await res.json()) as { data: Wish[] };
  return body.data;
}

/** `website` is a honeypot: always empty for people, often filled by bots. */
export async function submitRsvp(input: RsvpInput & { website: string }): Promise<void> {
  let res: Response;
  try {
    res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new RsvpRequestError("NETWORK");
  }
  if (!res.ok) throw await readError(res);
}

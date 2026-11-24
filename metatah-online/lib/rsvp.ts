import type { Attendance, RsvpErrors, RsvpInput } from "@/types/rsvp";

/**
 * Pure, isomorphic RSVP rules. The browser runs them for instant feedback;
 * the route handler runs them again as the authority. The database CHECK
 * constraints mirror the same limits.
 */
export const RSVP_LIMITS = {
  nameMax: 80,
  messageMin: 3,
  messageMax: 500,
  guestsMin: 1,
  guestsMax: 10,
} as const;

export type ValidRsvp = {
  name: string;
  attendance: Attendance;
  guests: number | null;
  message: string;
};

export function validateRsvp(
  input: RsvpInput,
): { ok: true; data: ValidRsvp } | { ok: false; errors: RsvpErrors } {
  const errors: RsvpErrors = {};
  const name = input.name.replace(/\s+/g, " ").trim();
  const message = input.message.replace(/\r\n/g, "\n").trim();

  if (!name) errors.name = "Mohon isi nama Anda.";
  else if (name.length > RSVP_LIMITS.nameMax)
    errors.name = `Nama maksimal ${RSVP_LIMITS.nameMax} karakter.`;

  if (input.attendance !== "hadir" && input.attendance !== "tidak_hadir")
    errors.attendance = "Mohon pilih konfirmasi kehadiran.";

  let guests: number | null = null;
  if (input.attendance === "hadir" && input.guests.trim() !== "") {
    const n = Number(input.guests);
    if (!Number.isInteger(n) || n < RSVP_LIMITS.guestsMin || n > RSVP_LIMITS.guestsMax)
      errors.guests = `Jumlah tamu antara ${RSVP_LIMITS.guestsMin}–${RSVP_LIMITS.guestsMax} orang.`;
    else guests = n;
  }

  if (message.length < RSVP_LIMITS.messageMin) errors.message = "Mohon tuliskan ucapan dan doa restu.";
  else if (message.length > RSVP_LIMITS.messageMax)
    errors.message = `Ucapan maksimal ${RSVP_LIMITS.messageMax} karakter.`;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    data: { name, attendance: input.attendance as Attendance, guests, message },
  };
}

/** Coerce an untrusted JSON body into the form shape without throwing. */
export function toRsvpInput(body: unknown): RsvpInput & { website: string } {
  const b = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "");
  const attendance = str(b.attendance);
  return {
    name: str(b.name),
    attendance: attendance === "hadir" || attendance === "tidak_hadir" ? attendance : "",
    guests: str(b.guests),
    message: str(b.message),
    website: str(b.website),
  };
}

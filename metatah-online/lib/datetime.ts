import type { InvitationData } from "@/types/invitation";

type EventInfo = InvitationData["event"];

/**
 * Build an absolute instant from the venue's local date/time and its fixed
 * offset, so the result is the same no matter which timezone the guest is in.
 */
export function toVenueInstant(date: string, time: string, utcOffset: string): Date {
  return new Date(`${date}T${time}:00${utcOffset}`);
}

export function getEventStart(event: EventInfo): Date {
  return toVenueInstant(event.date, event.startTime, event.utcOffset);
}

export function getEventEnd(event: EventInfo): Date {
  return toVenueInstant(event.date, event.endTime, event.utcOffset);
}

/** "Jumat, 15 Januari 2027" — always shown in the venue's timezone. */
export function formatEventDate(event: EventInfo): string {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: event.timezone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(getEventStart(event));
}

/** "15 · 01 · 2027" for compact display on the cover. */
export function formatEventDateCompact(event: EventInfo): string {
  const [year, month, day] = event.date.split("-");
  return `${day} · ${month} · ${year}`;
}

/** "09.00" — Indonesian convention uses a dot as the time separator. */
export function formatEventTime(time: string): string {
  return time.replace(":", ".");
}

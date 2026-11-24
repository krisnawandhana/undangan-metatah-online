import type { InvitationData } from "@/types/invitation";
import { getEventEnd, getEventStart } from "@/lib/datetime";

/** 2027-01-15T01:00:00.000Z → 20270115T010000Z */
function toCalendarStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function buildGoogleCalendarUrl(data: InvitationData): string {
  const { event, venue } = data;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.ceremony,
    dates: `${toCalendarStamp(getEventStart(event))}/${toCalendarStamp(getEventEnd(event))}`,
    details: event.description,
    location: `${venue.name}, ${venue.address}`,
    ctz: event.timezone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

import { afterAll, describe, expect, test } from "bun:test";
import { invitationData } from "@/data/invitation";
import { buildGoogleCalendarUrl } from "@/lib/calendar";
import {
  formatEventDate,
  formatEventTime,
  getEventEnd,
  getEventStart,
  toVenueInstant,
} from "@/lib/datetime";
import type { InvitationData } from "@/types/invitation";

const event: InvitationData["event"] = {
  ...invitationData.event,
  date: "2027-01-15",
  startTime: "09:00",
  endTime: "13:00",
  timezone: "Asia/Makassar",
  utcOffset: "+08:00",
};

// Guests open the link from anywhere; results must not depend on the device zone.
const GUEST_ZONES = ["UTC", "Asia/Makassar", "Asia/Jakarta", "America/Los_Angeles", "Asia/Tokyo", "Pacific/Kiritimati"];
const originalTz = process.env.TZ;
afterAll(() => {
  process.env.TZ = originalTz;
});

describe("event instants", () => {
  test("09:00 WITA is 01:00 UTC", () => {
    expect(getEventStart(event).toISOString()).toBe("2027-01-15T01:00:00.000Z");
    expect(getEventEnd(event).toISOString()).toBe("2027-01-15T05:00:00.000Z");
  });

  test.each(GUEST_ZONES)("same instant and label when the guest is in %s", (zone) => {
    process.env.TZ = zone;
    expect(getEventStart(event).getTime()).toBe(Date.UTC(2027, 0, 15, 1, 0, 0));
    expect(formatEventDate(event)).toBe("Jumat, 15 Januari 2027");
  });

  test("an early-morning ceremony keeps its Bali date even though UTC is the day before", () => {
    const dawn = { ...event, startTime: "00:30" };
    expect(getEventStart(dawn).toISOString()).toBe("2027-01-14T16:30:00.000Z");
    for (const zone of GUEST_ZONES) {
      process.env.TZ = zone;
      expect(formatEventDate(dawn)).toBe("Jumat, 15 Januari 2027");
    }
  });

  test("toVenueInstant honours the offset", () => {
    expect(toVenueInstant("2027-06-01", "18:45", "+08:00").toISOString()).toBe("2027-06-01T10:45:00.000Z");
  });

  test("time uses the Indonesian dot separator", () => {
    expect(formatEventTime("09:00")).toBe("09.00");
  });
});

describe("Google Calendar URL", () => {
  const data: InvitationData = { ...invitationData, event };
  const url = new URL(buildGoogleCalendarUrl(data));

  test("points at the event template endpoint", () => {
    expect(url.origin + url.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(url.searchParams.get("action")).toBe("TEMPLATE");
  });

  test("uses UTC timestamps for start/end and the venue timezone", () => {
    expect(url.searchParams.get("dates")).toBe("20270115T010000Z/20270115T050000Z");
    expect(url.searchParams.get("ctz")).toBe("Asia/Makassar");
  });

  test("carries title, description, and full location", () => {
    expect(url.searchParams.get("text")).toBe(event.ceremony);
    expect(url.searchParams.get("details")).toBe(event.description);
    expect(url.searchParams.get("location")).toBe(`${data.venue.name}, ${data.venue.address}`);
  });
});

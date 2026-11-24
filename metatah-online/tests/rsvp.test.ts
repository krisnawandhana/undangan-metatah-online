import { describe, expect, test } from "bun:test";
import { RSVP_LIMITS, toRsvpInput, validateRsvp } from "@/lib/rsvp";
import type { RsvpInput } from "@/types/rsvp";

const valid: RsvpInput = {
  name: "I Made Suardana",
  attendance: "hadir",
  guests: "2",
  message: "Rahajeng, semoga lancar.",
};

const errorsOf = (input: Partial<RsvpInput>) => {
  const r = validateRsvp({ ...valid, ...input });
  return r.ok ? {} : r.errors;
};

describe("validateRsvp", () => {
  test("accepts a complete RSVP and normalises whitespace", () => {
    const r = validateRsvp({ ...valid, name: "  I   Made  Suardana ", message: "  Rahajeng\r\nsemoga lancar  " });
    expect(r).toEqual({
      ok: true,
      data: { name: "I Made Suardana", attendance: "hadir", guests: 2, message: "Rahajeng\nsemoga lancar" },
    });
  });

  test("requires name, attendance, and message", () => {
    const r = validateRsvp({ name: " ", attendance: "", guests: "", message: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["attendance", "message", "name"]);
  });

  test("guest count is optional when attending", () => {
    const r = validateRsvp({ ...valid, guests: "" });
    expect(r.ok && r.data.guests).toBeNull();
  });

  test("guest count is ignored when not attending", () => {
    const r = validateRsvp({ ...valid, attendance: "tidak_hadir", guests: "99" });
    expect(r.ok && r.data.guests).toBeNull();
  });

  test.each(["0", "11", "2.5", "-1", "abc"])("rejects guest count %p", (guests) => {
    expect(errorsOf({ guests }).guests).toBeDefined();
  });

  test("enforces length limits", () => {
    expect(errorsOf({ name: "A".repeat(RSVP_LIMITS.nameMax + 1) }).name).toBeDefined();
    expect(errorsOf({ name: "A".repeat(RSVP_LIMITS.nameMax) }).name).toBeUndefined();
    expect(errorsOf({ message: "ok" }).message).toBeDefined();
    expect(errorsOf({ message: "A".repeat(RSVP_LIMITS.messageMax + 1) }).message).toBeDefined();
    expect(errorsOf({ message: "A".repeat(RSVP_LIMITS.messageMax) }).message).toBeUndefined();
  });
});

describe("toRsvpInput (untrusted JSON)", () => {
  test.each([null, undefined, 42, "string", [1, 2]])("never throws on %p", (body) => {
    expect(toRsvpInput(body)).toEqual({ name: "", attendance: "", guests: "", message: "", website: "" });
  });

  test("keeps only known attendance values", () => {
    expect(toRsvpInput({ attendance: "hadir" }).attendance).toBe("hadir");
    expect(toRsvpInput({ attendance: "admin" }).attendance).toBe("");
    expect(toRsvpInput({ attendance: ["hadir"] }).attendance).toBe("");
  });

  test("coerces numbers, drops objects", () => {
    const input = toRsvpInput({ name: { $ne: "" }, guests: 3, message: "Hai", website: "x" });
    expect(input).toEqual({ name: "", attendance: "", guests: "3", message: "Hai", website: "x" });
  });
});

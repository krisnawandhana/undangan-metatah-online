import { describe, expect, test } from "bun:test";
import { getCountdownParts } from "@/hooks/useCountdown";
import { buildDirectionsUrl, buildEmbedUrl } from "@/lib/maps";
import { getInitials, sanitizeGuestName, toOrdinal } from "@/lib/utils";

describe("sanitizeGuestName", () => {
  test.each([
    [null, null],
    [undefined, null],
    ["", null],
    ["   ", null],
    ["I Made Suardana", "I Made Suardana"],
    ["  Keluarga   Bapak\tMade  ", "Keluarga Bapak Made"],
    ["Ni Putu\u0000 Sari\u001F", "Ni Putu Sari"],
  ])("%p → %p", (input, expected) => {
    expect(sanitizeGuestName(input)).toBe(expected);
  });

  test("caps very long names at 80 characters", () => {
    expect(sanitizeGuestName("A".repeat(500))).toHaveLength(80);
  });

  test("leaves markup as literal text (React escapes it on render)", () => {
    expect(sanitizeGuestName("<b>Tamu</b>")).toBe("<b>Tamu</b>");
  });

  test("works with a value decoded from a real invitation URL", () => {
    const to = new URL("https://undangan.example/?to=Keluarga%20Bapak%20Made").searchParams.get("to");
    expect(sanitizeGuestName(to)).toBe("Keluarga Bapak Made");
  });
});

describe("toOrdinal / getInitials", () => {
  test("Indonesian ordinals", () => {
    expect(toOrdinal(1)).toBe("pertama");
    expect(toOrdinal(4)).toBe("keempat");
    expect(toOrdinal(8)).toBe("ke-8");
  });

  test("initials skip Balinese honorific particles", () => {
    expect(getInitials("I Putu Agus Mahendra")).toBe("PA");
    expect(getInitials("Ni Kadek Ayu Lestari")).toBe("KL");
    expect(getInitials("Wayan")).toBe("W");
  });
});

describe("maps", () => {
  const venue = { name: "Rumah", address: "Jl. Raya", mapsQuery: "Peliatan, Ubud, Gianyar, Bali" };

  test("directions URL targets the venue", () => {
    const url = new URL(buildDirectionsUrl(venue));
    expect(url.origin + url.pathname).toBe("https://www.google.com/maps/dir/");
    expect(url.searchParams.get("api")).toBe("1");
    expect(url.searchParams.get("destination")).toBe(venue.mapsQuery);
  });

  test("embed URL is keyless by default and respects an override", () => {
    const url = new URL(buildEmbedUrl(venue));
    expect(url.searchParams.get("output")).toBe("embed");
    expect(url.searchParams.get("q")).toBe(venue.mapsQuery);
    expect(buildEmbedUrl({ ...venue, embedUrl: "https://www.google.com/maps/embed?pb=x" })).toBe(
      "https://www.google.com/maps/embed?pb=x",
    );
  });
});

describe("getCountdownParts", () => {
  test("splits into days/hours/minutes/seconds", () => {
    const target = 2_000_000_000;
    expect(getCountdownParts(target, target - (86400 + 3600 + 60 + 1))).toEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      done: false,
    });
  });

  test("stops at zero instead of going negative", () => {
    expect(getCountdownParts(100, 100)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
    expect(getCountdownParts(100, 5000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, done: true });
  });
});

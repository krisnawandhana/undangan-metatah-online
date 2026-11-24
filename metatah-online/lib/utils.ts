export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const ORDINALS = ["pertama", "kedua", "ketiga", "keempat", "kelima", "keenam", "ketujuh"];

/** 1 → "pertama", 8 → "ke-8" */
export function toOrdinal(n: number): string {
  return ORDINALS[n - 1] ?? `ke-${n}`;
}

const GUEST_NAME_MAX = 80;

/**
 * Normalise the `?to=` value. React renders it as text, so this is about
 * tidiness, not escaping: strip control characters, collapse whitespace,
 * cap the length.
 */
export function sanitizeGuestName(raw: string | null | undefined): string | null {
  if (!raw) return null;
  // Whitespace first, so tabs/newlines become spaces instead of gluing words.
  const cleaned = raw
    .replace(/\s+/g, " ")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, GUEST_NAME_MAX);
  return cleaned.length > 0 ? cleaned : null;
}

export function getInitials(name: string): string {
  const parts = name
    .split(" ")
    .filter((p) => !["I", "Ni", "Ida", "Bagus", "Ayu", "Gusti"].includes(p));
  const picked = parts.length >= 2 ? [parts[0], parts[1]] : parts;
  return picked.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

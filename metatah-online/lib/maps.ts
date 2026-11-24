import type { InvitationData } from "@/types/invitation";

type Venue = InvitationData["venue"];

export function buildDirectionsUrl(venue: Venue): string {
  const params = new URLSearchParams({ api: "1", destination: venue.mapsQuery });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/** Keyless embed. Prefer `venue.embedUrl` when the family supplies one. */
export function buildEmbedUrl(venue: Venue): string {
  if (venue.embedUrl) return venue.embedUrl;
  const params = new URLSearchParams({ q: venue.mapsQuery, output: "embed" });
  return `https://www.google.com/maps?${params.toString()}`;
}

"use client";

import { useSearchParams } from "next/navigation";
import { sanitizeGuestName } from "@/lib/utils";

/**
 * Reads `?to=` from the URL. Components using this must sit inside a
 * <Suspense> boundary (required by Cache Components / prerendering).
 * Returns null when the parameter is missing or empty.
 */
export function useGuestName(): string | null {
  const params = useSearchParams();
  return sanitizeGuestName(params.get("to"));
}

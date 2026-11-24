"use client";

import type { gsap as Gsap } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

/** Media conditions shared by every animation. */
export const MOTION = {
  /** Animate only when the guest hasn't asked for reduced motion. */
  ok: "(prefers-reduced-motion: no-preference)",
  desktop: "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
  mobile: "(prefers-reduced-motion: no-preference) and (max-width: 767px)",
} as const;

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type GsapRuntime = { gsap: typeof Gsap; ScrollTrigger: typeof ScrollTriggerType };

let pending: Promise<GsapRuntime> | null = null;

/**
 * GSAP is kept out of the initial bundle: it is fetched on idle after the
 * page hydrates, and every animation awaits this before running. Callers
 * must treat a rejection as "no animation" and show content immediately.
 */
export function loadGsap(): Promise<GsapRuntime> {
  pending ??= import("@/lib/gsap").catch((err: unknown) => {
    pending = null; // allow a retry later
    throw err;
  });
  return pending;
}

/** Warm the GSAP chunk once the browser is idle. */
export function preloadGsap(): () => void {
  if (prefersReducedMotion()) return () => {};
  const run = () => void loadGsap().catch(() => {});
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(run, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(run, 600);
  return () => clearTimeout(id);
}

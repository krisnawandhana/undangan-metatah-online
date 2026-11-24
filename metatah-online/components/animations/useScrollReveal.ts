"use client";

import { useEffect, type RefObject } from "react";
import { MOTION, loadGsap } from "@/lib/motion";

/**
 * Declarative scroll reveals. Server Components opt in with data attributes,
 * so they stay static and ship no JS of their own:
 *
 *   data-reveal                 fade + rise when it enters the viewport
 *   data-reveal="fade"          fade only
 *   data-reveal-delay="0.2"     extra delay (seconds), works on all patterns
 *   data-reveal-stagger         container; its [data-reveal-item] stagger in
 *   data-reveal-sequence        container; its [data-reveal-step] play in order
 *   data-reveal-zoom            image settles from a slight zoom (desktop only)
 *
 * Nothing is hidden before this runs, so content stays visible without JS
 * (or if GSAP fails to load), and with prefers-reduced-motion no tween is
 * created at all. Everything is created inside one gsap.context and reverted
 * on unmount.
 */
export function useScrollReveal(scope: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const root = scope.current;
    if (!enabled || !root) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    loadGsap()
      .then(({ gsap, ScrollTrigger }) => {
        if (cancelled) return;
        const ctx = gsap.context(() => {
          const mm = gsap.matchMedia();
          mm.add({ mobile: MOTION.mobile, desktop: MOTION.desktop }, (mmCtx) => {
            const { mobile, desktop } = mmCtx.conditions as { mobile: boolean; desktop: boolean };
            const dist = mobile ? 16 : 28;
            const delayOf = (el: Element) => Number((el as HTMLElement).dataset.revealDelay ?? 0);
            const trigger = (el: Element, start = "top 88%") => ({ trigger: el, start, once: true });
            const all = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

            all("[data-reveal]").forEach((el) => {
              gsap.from(el, {
                autoAlpha: 0,
                y: el.dataset.reveal === "fade" ? 0 : dist,
                delay: delayOf(el),
                scrollTrigger: trigger(el),
              });
            });

            all("[data-reveal-stagger]").forEach((group) => {
              const items = group.querySelectorAll("[data-reveal-item]");
              if (items.length === 0) return;
              gsap.from(items, {
                autoAlpha: 0,
                y: dist,
                duration: 0.7,
                stagger: mobile ? 0.07 : 0.11,
                delay: delayOf(group),
                scrollTrigger: trigger(group, "top 85%"),
              });
            });

            all("[data-reveal-sequence]").forEach((seq) => {
              const steps = seq.querySelectorAll("[data-reveal-step]");
              const tl = gsap.timeline({ delay: delayOf(seq), scrollTrigger: trigger(seq, "top 85%") });
              steps.forEach((step, i) => {
                tl.from(
                  step,
                  { autoAlpha: 0, y: i === 0 ? dist * 1.5 : dist * 0.5, duration: i === 0 ? 1 : 0.55 },
                  i === 0 ? 0 : ">-0.3",
                );
              });
            });

            if (desktop) {
              all("[data-reveal-zoom]").forEach((el) => {
                gsap.from(el, { scale: 1.08, duration: 1.4, scrollTrigger: trigger(el, "top 92%") });
              });
            }
          });
        }, root);
        revert = () => ctx.revert();
        // The cover locked scrolling while it was up; recompute positions.
        ScrollTrigger.refresh();
      })
      .catch(() => {
        /* GSAP unavailable: content is already visible, nothing to do. */
      });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [scope, enabled]);
}

"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { CandiBentar } from "@/components/ornaments/CandiBentar";
import { GuestGreeting, GuestGreetingView } from "@/components/invitation/GuestGreeting";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { loadGsap, prefersReducedMotion } from "@/lib/motion";

export type CoverContent = {
  eyebrow: string;
  title: string;
  altTitle: string;
  names: string;
  dateLabel: string;
  dateTime: string;
};

type Props = CoverContent & {
  contentId: string;
  /** Fired synchronously in the click handler — safe place to start audio. */
  onOpenStart: () => void;
  /** Fired mid-transition, when the page underneath should start revealing. */
  onReveal: () => void;
  /** Fired when the cover is fully gone and can unmount. */
  onClosed: () => void;
};

/**
 * Fullscreen cover. The entrance is pure CSS (it runs from first paint, so
 * there is no flash before hydration); the exit is a GSAP timeline in which
 * the two halves of the candi bentar part like a gate opening.
 */
export function OpeningCover({
  eyebrow,
  title,
  altTitle,
  names,
  dateLabel,
  dateTime,
  contentId,
  onOpenStart,
  onReveal,
  onClosed,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<{ kill: () => unknown } | null>(null);
  const unmounted = useRef(false);
  const [opening, setOpening] = useState(false);

  // Reset on every mount: StrictMode (dev) runs mount → cleanup → mount, and a
  // flag left at `true` would silently cancel the opening animation.
  useEffect(() => {
    unmounted.current = false;
    return () => {
      unmounted.current = true;
      timelineRef.current?.kill();
    };
  }, []);

  const handleOpen = () => {
    const root = rootRef.current;
    if (opening || !root) return;
    setOpening(true);
    onOpenStart();

    const openInstantly = () => {
      onReveal();
      onClosed();
    };
    if (prefersReducedMotion()) return openInstantly();

    // GSAP is normally preloaded by now; if it can't load, just open.
    loadGsap()
      .then(({ gsap }) => {
        if (unmounted.current) return;
        const q = gsap.utils.selector(root);
        timelineRef.current = gsap
          .timeline({ onComplete: onClosed })
          .to(q("[data-cover-content]"), { autoAlpha: 0, y: -14, duration: 0.45, ease: "power2.in" })
          .to(q("[data-gate='left']"), { xPercent: -105, duration: 1.15, ease: "power3.inOut" }, 0.1)
          .to(q("[data-gate='right']"), { xPercent: 105, duration: 1.15, ease: "power3.inOut" }, 0.1)
          .add(onReveal, 0.7)
          .to(root, { autoAlpha: 0, duration: 0.55, ease: "power1.out" }, 0.75);
      })
      .catch(openInstantly);
  };

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cover-title"
      className="fixed inset-0 z-50 overflow-x-hidden overflow-y-auto bg-ivory"
    >
      {/* Soft vignette towards the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,var(--color-ivory)_40%,var(--color-cream)_100%)]"
      />

      {/* Gate halves: outer div sets the resting position, inner div parts */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 left-0 h-[46svh] -translate-x-[58%] text-gold sm:h-[78svh] sm:-translate-x-[30%] lg:h-[88svh] lg:-translate-x-[6%]"
      >
        <div data-gate="left" className="h-full">
          <CandiBentar side="left" className="h-full w-auto motion-safe:animate-gate-rise" />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-0 bottom-0 h-[46svh] translate-x-[58%] text-gold sm:h-[78svh] sm:translate-x-[30%] lg:h-[88svh] lg:translate-x-[6%]"
      >
        <div data-gate="right" className="h-full">
          <CandiBentar side="right" className="h-full w-auto motion-safe:animate-gate-rise" />
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-0 h-px bg-gold/50" />

      <div
        data-cover-content
        className="relative flex min-h-svh flex-col items-center justify-center px-6 py-14 text-center"
      >
        <p className="eyebrow text-terracotta-ink motion-safe:animate-rise">{eyebrow}</p>

        <h1 id="cover-title" className="mt-6">
          <span className="block text-[clamp(3.5rem,16vw,7rem)] leading-[0.88] font-medium tracking-[-0.01em] motion-safe:animate-rise motion-safe:[animation-delay:120ms]">
            {title}
          </span>
          <span className="mt-3 block text-[clamp(1.75rem,7vw,2.75rem)] leading-none text-brown-soft italic motion-safe:animate-rise motion-safe:[animation-delay:240ms]">
            <span className="text-gold not-italic">/</span> {altTitle}
          </span>
        </h1>

        <p className="mt-8 font-serif text-[1.625rem] leading-snug italic motion-safe:animate-rise motion-safe:[animation-delay:380ms] sm:text-3xl">
          {names}
        </p>

        <p className="mt-5 flex items-center gap-4 text-[0.8125rem] tracking-[0.14em] text-brown-soft uppercase motion-safe:animate-rise motion-safe:[animation-delay:480ms]">
          <span aria-hidden="true" className="h-px w-8 bg-gold sm:w-12" />
          <time dateTime={dateTime}>{dateLabel}</time>
          <span aria-hidden="true" className="h-px w-8 bg-gold sm:w-12" />
        </p>

        <div className="mt-10 w-full motion-safe:animate-rise motion-safe:[animation-delay:620ms]">
          <Suspense fallback={<GuestGreetingView name={null} />}>
            <GuestGreeting />
          </Suspense>
        </div>

        <PrimaryButton
          size="caps"
          className="mt-8 motion-safe:animate-rise motion-safe:[animation-delay:760ms]"
          onClick={handleOpen}
          disabled={opening}
          aria-controls={contentId}
        >
          Buka Undangan
        </PrimaryButton>
      </div>
    </div>
  );
}

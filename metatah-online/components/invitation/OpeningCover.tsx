"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { GuestAddress, GuestAddressView } from "@/components/invitation/GuestGreeting";
import { CandiBentar } from "@/components/ornaments/CandiBentar";
import { PatraDivider } from "@/components/ornaments/Patra";
import { Penjor } from "@/components/ornaments/Penjor";
import { WaxSeal } from "@/components/ornaments/WaxSeal";
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

type Timeline = { kill: () => unknown; timeScale: (v: number) => unknown };

/**
 * Fullscreen cover presented as a sealed letter, framed by the candi bentar.
 *
 * Closed: an envelope addressed to the guest, sealed with wax.
 * Opening (GSAP): the seal lifts, the flap folds back, the letter slides out
 * with the invitation title, holds so it can be read, then the gate parts
 * onto the invitation. Tapping anywhere while it plays speeds it up.
 * Reduced motion: the letter is shown open without movement, then fades.
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
  const timelineRef = useRef<Timeline | null>(null);
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

    // GSAP is normally preloaded by now; if it can't load, just open.
    loadGsap()
      .then(({ gsap }) => {
        if (unmounted.current) return;
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ onComplete: onClosed });

        if (prefersReducedMotion()) {
          // Same end state, no movement: show the open letter, then fade.
          tl.set(q("[data-cover-intro], [data-cover-button], [data-seal]"), { autoAlpha: 0 })
            .set(q("[data-flap]"), { rotateX: 180, zIndex: 5 })
            .set(q("[data-letter]"), { yPercent: -80 })
            .set(q("[data-envelope-group]"), { yPercent: 35 })
            .add(onReveal, 2)
            .to(root, { autoAlpha: 0, duration: 0.4, ease: "none" }, 2);
        } else {
          tl.to(q("[data-cover-intro], [data-cover-button]"), { autoAlpha: 0, y: 8, duration: 0.3, ease: "power1.in" }, 0)
            // The seal lifts off…
            .to(q("[data-seal]"), { scale: 0.6, rotate: -14, autoAlpha: 0, duration: 0.4, ease: "back.in(2)" }, 0)
            // …the flap folds back, passing behind the letter halfway through…
            .to(q("[data-flap]"), { rotateX: 180, duration: 0.7, ease: "power2.inOut" }, 0.25)
            .set(q("[data-flap]"), { zIndex: 5 }, 0.6)
            // …and the letter slides out while the envelope settles lower.
            .to(q("[data-letter]"), { yPercent: -80, duration: 1, ease: "power3.out" }, 0.8)
            .to(q("[data-envelope-group]"), { yPercent: 35, duration: 1, ease: "power3.out" }, 0.8)
            // Hold so the guest can read it, then the gate opens.
            .addLabel("exit", "+=1.3")
            .to(q("[data-cover-content]"), { autoAlpha: 0, y: -24, duration: 0.6, ease: "power2.in" }, "exit")
            .to(q("[data-gate='left']"), { xPercent: -105, duration: 1.15, ease: "power3.inOut" }, "exit")
            .to(q("[data-gate='right']"), { xPercent: 105, duration: 1.15, ease: "power3.inOut" }, "exit")
            .add(onReveal, "exit+=0.6")
            .to(root, { autoAlpha: 0, duration: 0.55, ease: "power1.out" }, "exit+=0.65");
        }
        timelineRef.current = tl;
      })
      .catch(openInstantly);
  };

  // A tap while the letter is opening fast-forwards the sequence.
  const handleSkip = () => {
    if (opening) timelineRef.current?.timeScale(4);
  };

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cover-title"
      onClick={handleSkip}
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
        <div data-gate="left" className="relative h-full">
          <CandiBentar side="left" className="h-full w-auto motion-safe:animate-gate-rise" />
          {/* Penjor beside the gate on wide screens; leaves with the gate. */}
          <div className="absolute bottom-0 left-full ml-2 hidden h-[92%] xl:block">
            <div className="h-full origin-[29%_100%] motion-safe:animate-sway">
              <Penjor className="h-full w-auto motion-safe:animate-gate-rise motion-safe:[animation-delay:250ms]" />
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-0 bottom-0 h-[46svh] translate-x-[58%] text-gold sm:h-[78svh] sm:translate-x-[30%] lg:h-[88svh] lg:translate-x-[6%]"
      >
        <div data-gate="right" className="relative h-full">
          <CandiBentar side="right" className="h-full w-auto motion-safe:animate-gate-rise" />
          <div className="absolute right-full bottom-0 mr-2 hidden h-[92%] xl:block">
            <div className="h-full origin-[71%_100%] motion-safe:animate-sway motion-safe:[animation-delay:-3.5s]">
              <Penjor mirror className="h-full w-auto motion-safe:animate-gate-rise motion-safe:[animation-delay:250ms]" />
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-0 h-px bg-gold/50" />

      <div
        data-cover-content
        className="relative flex min-h-svh flex-col items-center justify-center px-5 py-12 text-center"
      >
        {/* GSAP moves the data-* wrappers; the CSS entrance runs on their children,
            so the two never fight over the same transform. */}
        <div data-cover-intro>
          <p className="eyebrow text-terracotta-ink motion-safe:animate-rise">Surat Undangan</p>
        </div>

        <div data-envelope-group className="mt-7 w-[min(88vw,26rem)]">
          <div className="motion-safe:animate-rise motion-safe:[animation-delay:150ms]">
            <div
              data-envelope
              onClick={handleOpen}
              className="relative aspect-[10/9] cursor-pointer [perspective:1400px] sm:aspect-[5/4]"
            >
              {/* Inside of the envelope */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cream-deep shadow-[0_18px_40px_-18px_rgb(73_56_46/0.45)]"
              />

              {/* The letter */}
              <div
                data-letter
                className="absolute inset-x-[5%] top-[6%] z-10 h-[88%] bg-ivory px-4 pt-5 shadow-[0_2px_10px_-4px_rgb(73_56_46/0.3)] sm:pt-7"
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-[6px] border border-gold/45" />
                <p className="eyebrow text-[0.625rem] text-terracotta-ink">{eyebrow}</p>
                <h1 id="cover-title" className="mt-2.5 sm:mt-3">
                  <span className="block text-[clamp(2.6rem,12vw,3.75rem)] leading-[0.9] font-medium">{title}</span>
                  <span className="mt-1 block text-[clamp(1.25rem,5.5vw,1.75rem)] leading-none text-brown-soft italic">
                    <span className="text-gold not-italic">/</span> {altTitle}
                  </span>
                </h1>
                <p className="mt-3 font-serif text-lg leading-snug italic sm:mt-4 sm:text-xl">{names}</p>
                <PatraDivider className="mx-auto mt-2 h-3 w-32 text-gold sm:mt-3" />
                <p className="mt-1.5 text-[0.6875rem] tracking-[0.14em] text-brown-soft uppercase sm:mt-2">
                  <time dateTime={dateTime}>{dateLabel}</time>
                </p>
              </div>

              {/* Front pocket — covers the letter until the flap is open */}
              <svg
                aria-hidden="true"
                viewBox="0 0 100 80"
                preserveAspectRatio="none"
                className="absolute inset-0 z-20 h-full w-full"
              >
                <path
                  d="M0 0 50 42 100 0V80H0Z"
                  className="fill-cream stroke-gold/70"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M0 80 41 47M100 80 59 47"
                  className="stroke-gold/40"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  fill="none"
                />
              </svg>

              {/* Addressee written on the envelope */}
              <div className="absolute inset-x-[8%] bottom-[7%] z-30">
                <Suspense fallback={<GuestAddressView name={null} />}>
                  <GuestAddress />
                </Suspense>
              </div>

              {/* Flap — folds back around its top edge */}
              <div
                data-flap
                aria-hidden="true"
                className="absolute inset-x-0 top-0 z-40 h-[56%] origin-top"
              >
                <svg viewBox="0 0 100 56" preserveAspectRatio="none" className="h-full w-full">
                  <path
                    d="M0 0H100L50 56Z"
                    className="fill-cream-deep stroke-gold/70"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d="M8 3H92L50 50Z"
                    className="stroke-gold/35"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Wax seal at the tip of the flap */}
              <div
                data-seal
                aria-hidden="true"
                className="absolute top-[56%] left-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
              >
                <WaxSeal className="size-12 sm:size-16" />
              </div>
            </div>
          </div>
        </div>

        <div data-cover-button className="mt-9">
          <PrimaryButton
            size="caps"
            className="motion-safe:animate-rise motion-safe:[animation-delay:300ms]"
            onClick={handleOpen}
            disabled={opening}
            aria-controls={contentId}
          >
            Buka Undangan
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

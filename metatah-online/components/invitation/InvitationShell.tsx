"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useScrollReveal } from "@/components/animations/useScrollReveal";
import { OpeningCover, type CoverContent } from "@/components/invitation/OpeningCover";
import { MusicControl } from "@/components/ui/MusicControl";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { preloadGsap } from "@/lib/motion";
import type { InvitationData } from "@/types/invitation";

type Stage = "closed" | "revealing" | "open";

type Props = {
  cover: CoverContent;
  music: InvitationData["music"];
  /** Server-rendered sections, passed through untouched. */
  children: ReactNode;
};

const CONTENT_ID = "undangan";

/**
 * The only client boundary around the page body. It owns the cover stage,
 * the scroll lock, background music, and scroll animations. The sections
 * themselves remain Server Components passed in as children.
 */
export function InvitationShell({ cover, music, children }: Props) {
  const mainRef = useRef<HTMLElement>(null);
  const [stage, setStage] = useState<Stage>("closed");
  const bgm = useBackgroundMusic(music.src, music.enabled);

  useScrollReveal(mainRef, stage !== "closed");

  // Fetch the animation library while the guest reads the cover.
  useEffect(() => preloadGsap(), []);

  // Lock page scroll while the cover is up.
  useEffect(() => {
    if (stage !== "closed") return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [stage]);

  // Hand focus to the invitation once the cover is gone.
  useEffect(() => {
    if (stage === "open") mainRef.current?.focus({ preventScroll: true });
  }, [stage]);

  return (
    <>
      {stage !== "open" && (
        <OpeningCover
          {...cover}
          contentId={CONTENT_ID}
          onOpenStart={bgm.start}
          onReveal={() => setStage((s) => (s === "closed" ? "revealing" : s))}
          onClosed={() => setStage("open")}
        />
      )}

      <main
        ref={mainRef}
        id={CONTENT_ID}
        tabIndex={-1}
        inert={stage === "closed"}
        className="outline-none"
      >
        <span id="top" />
        {/* The visible title lives on the cover; keep one h1 for the page itself. */}
        <h1 className="sr-only">
          Undangan {cover.title} {cover.altTitle} · {cover.names}
        </h1>
        {children}
      </main>

      {stage !== "closed" && bgm.available && (
        <MusicControl playing={bgm.playing} onToggle={bgm.toggle} title={music.title} />
      )}
    </>
  );
}

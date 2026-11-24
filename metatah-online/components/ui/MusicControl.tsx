"use client";

import { Disc3, VolumeX } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Props = {
  playing: boolean;
  onToggle: () => void;
  title: string;
};

export function MusicControl({ playing, onToggle, title }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? `Jeda musik: ${title}` : `Putar musik: ${title}`}
      title={playing ? "Jeda musik" : "Putar musik"}
      className={cn(
        "fixed right-4 bottom-4 z-40 grid size-12 place-items-center rounded-full border bg-ivory/90 shadow-[0_6px_24px_-8px_rgb(73_56_46/0.35)] backdrop-blur-sm transition-colors sm:right-6 sm:bottom-6",
        playing ? "border-gold text-brown" : "border-line text-brown-soft hover:border-gold",
      )}
    >
      {playing ? (
        <Disc3 size={22} className="motion-safe:animate-[spin_6s_linear_infinite]" />
      ) : (
        <VolumeX size={20} />
      )}
    </button>
  );
}

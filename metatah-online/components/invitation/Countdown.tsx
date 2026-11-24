"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";

const UNITS = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
] as const;

export function Countdown({ targetMs }: { targetMs: number }) {
  const parts = useCountdown(targetMs);

  if (parts?.done) {
    return (
      <p className="text-center font-serif text-2xl text-ivory italic">
        Hari yang dinanti telah tiba. Terima kasih atas doa restunya.
      </p>
    );
  }

  return (
    // Not a live region on purpose: announcing every second is noise.
    <dl className="mx-auto grid max-w-[34rem] grid-cols-4" aria-label="Hitung mundur menuju hari upacara">
      {UNITS.map(({ key, label }, i) => (
        <div
          key={key}
          className={cn("flex flex-col-reverse items-center gap-3", i > 0 && "border-l border-gold/30")}
        >
          <dt className="eyebrow text-gold-light">{label}</dt>
          <dd className="numerals font-serif text-[2.75rem] leading-none font-medium text-ivory sm:text-6xl">
            {parts ? String(parts[key]).padStart(2, "0") : "––"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

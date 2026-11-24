import Image from "next/image";
import { PatraFlourish } from "@/components/ornaments/Patra";
import { cn, getInitials, toOrdinal } from "@/lib/utils";
import type { Parents, Participant } from "@/types/invitation";

type Props = {
  participant: Participant;
  parents: Parents;
  /** Position in the grid, used to offset the reveal on wide screens. */
  index?: number;
};

export function ParticipantCard({ participant, parents, index = 0 }: Props) {
  const { name, gender, birthOrder, photo, message } = participant;
  const label = gender === "putra" ? "Putra" : "Putri";

  return (
    <article
      data-reveal-sequence
      data-reveal-delay={String(index * 0.15)}
      className="flex flex-col items-center text-center"
    >
      {/* Portrait: notched frame with an offset gold outline behind it */}
      <div data-reveal-step className="relative w-full max-w-[20rem]">
        <div aria-hidden="true" className="frame-notched absolute inset-0 translate-x-2.5 translate-y-2.5 bg-gold/35" />
        <div className="frame-notched relative aspect-[4/5] overflow-hidden bg-cream-deep">
          {photo ? (
            <Image
              src={photo}
              alt={`Potret ${name}`}
              fill
              sizes="(max-width: 640px) 90vw, 320px"
              className="object-cover"
            />
          ) : (
            <PortraitPlaceholder name={name} />
          )}
        </div>
      </div>

      <h3 data-reveal-step className="mt-10 text-[2rem] leading-tight font-medium sm:text-[2.25rem]">
        {name}
      </h3>

      <div data-reveal-step>
        <p className="mt-4 text-[0.9375rem] text-brown-soft">
          {label} {toOrdinal(birthOrder)} dari
        </p>
        <p className="mt-1 font-serif text-xl leading-snug">
          Bapak {parents.father}
          <br />
          <span className="text-gold-ink">&amp;</span> Ibu {parents.mother}
        </p>
      </div>

      {message && (
        <blockquote
          data-reveal-step
          className="mt-6 max-w-[19rem] border-t border-line pt-5 font-serif text-lg leading-relaxed text-brown-soft italic"
        >
          “{message}”
        </blockquote>
      )}
    </article>
  );
}

function PortraitPlaceholder({ name }: { name: string }) {
  return (
    <div
      role="img"
      aria-label={`Foto ${name} belum tersedia`}
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-4 text-gold-ink",
        "bg-[radial-gradient(ellipse_at_50%_40%,var(--color-cream)_0%,var(--color-cream-deep)_75%)]",
      )}
    >
      <PatraFlourish className="h-12 w-24 opacity-60" />
      <span className="font-serif text-6xl leading-none tracking-wide italic opacity-70">
        {getInitials(name)}
      </span>
    </div>
  );
}

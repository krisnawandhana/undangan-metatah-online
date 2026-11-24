"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { PatraFlourish } from "@/components/ornaments/Patra";
import { ChevronLeft, ChevronRight, X } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types/invitation";

const ratio: Record<GalleryImage["orientation"], string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  square: "aspect-square",
};

const placeholderTint = ["bg-cream-deep", "bg-[#e6dccb]", "bg-[#dcdccd]", "bg-[#eadbd0]"];

export function PhotoGallery({ images }: { images: GalleryImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);

  const open = (index: number) => {
    setActive(index);
    dialogRef.current?.showModal();
  };

  const step = useCallback(
    (delta: number) => setActive((i) => (i + delta + images.length) % images.length),
    [images.length],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };

  // Clicking the backdrop or the empty area around the photo closes it.
  const onDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
    const target = e.target as HTMLElement;
    if (target === e.currentTarget || target.dataset.dismiss !== undefined) {
      dialogRef.current?.close();
    }
  };

  const current = images[active];

  return (
    <>
      <ul data-reveal-stagger className="columns-2 gap-3 sm:gap-4 md:columns-3">
        {images.map((img, i) => (
          <li key={i} data-reveal-item className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => open(i)}
              className="group relative block w-full overflow-hidden"
              aria-label={`Perbesar foto: ${img.alt}`}
            >
              <div data-reveal-zoom className={cn("relative w-full", ratio[img.orientation])}>
                {img.src ? (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 360px"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
                  />
                ) : (
                  <Placeholder alt={img.alt} tint={placeholderTint[i % placeholderTint.length]} />
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Galeri foto"
        onKeyDown={onKeyDown}
        onClick={onDialogClick}
        className="m-auto h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-brown/90 sm:h-auto sm:max-h-[92svh] sm:max-w-[min(92vw,960px)]"
      >
        {current && (
          <figure data-dismiss className="flex h-full flex-col justify-center px-4 py-16 sm:px-0 sm:py-0">
            <div className={cn("relative mx-auto max-h-[72svh] w-full", ratio[current.orientation], current.orientation === "portrait" && "max-w-[min(100%,58svh)]")}>
              {current.src ? (
                <Image src={current.src} alt={current.alt} fill sizes="92vw" className="object-contain" />
              ) : (
                <Placeholder alt={current.alt} tint="bg-cream" large />
              )}
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-4 text-ivory">
              <span className="font-serif text-lg italic">{current.alt}</span>
              <span className="numerals shrink-0 text-sm text-ivory/70">
                {active + 1} / {images.length}
              </span>
            </figcaption>
          </figure>
        )}

        <div className="pointer-events-none fixed inset-x-0 top-0 flex justify-end p-3 sm:p-5">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="pointer-events-auto grid size-12 place-items-center text-ivory hover:text-gold"
            aria-label="Tutup galeri"
            autoFocus
          >
            <X size={24} />
          </button>
        </div>
        {images.length > 1 && (
          <div className="pointer-events-none fixed inset-x-0 bottom-0 flex justify-center gap-2 p-3 sm:inset-y-0 sm:bottom-auto sm:items-center sm:justify-between sm:p-5">
            <button
              type="button"
              onClick={() => step(-1)}
              className="pointer-events-auto grid size-12 place-items-center border border-ivory/30 text-ivory hover:border-gold hover:text-gold"
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="pointer-events-auto grid size-12 place-items-center border border-ivory/30 text-ivory hover:border-gold hover:text-gold"
              aria-label="Foto berikutnya"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}

function Placeholder({ alt, tint, large }: { alt: string; tint: string; large?: boolean }) {
  return (
    <div
      role="img"
      aria-label={`${alt} (foto menyusul)`}
      className={cn("flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center", tint)}
    >
      <PatraFlourish className={cn("text-gold-ink/60", large ? "h-16 w-32" : "h-8 w-16 sm:h-10 sm:w-20")} />
      <span className={cn("font-serif text-brown italic", large ? "text-2xl" : "text-sm sm:text-base")}>
        {alt}
      </span>
    </div>
  );
}

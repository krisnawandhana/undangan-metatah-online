"use client";

import { useGuestName } from "@/hooks/useGuestName";
import { cn } from "@/lib/utils";

export const GUEST_FALLBACK = "Bapak/Ibu/Saudara/i";

/**
 * The addressee written on the front of the envelope. Pure view — also used
 * as the Suspense fallback before the URL has been read.
 */
export function GuestAddressView({ name }: { name: string | null }) {
  return (
    <div className="text-center">
      <p className="text-[0.75rem] leading-snug text-brown-soft">
        Kepada Yth.{name && <> {GUEST_FALLBACK}</>}
      </p>
      <p
        className={cn(
          "mx-auto mt-1 inline-block max-w-full border-b border-dotted border-gold-ink/50 px-2 pb-1 font-serif leading-tight font-medium break-words",
          (name ?? GUEST_FALLBACK).length > 32 ? "text-lg" : "text-[1.375rem] sm:text-[1.625rem]",
        )}
      >
        {name ?? GUEST_FALLBACK}
      </p>
      <p className="mt-1.5 text-[0.75rem] leading-snug text-brown-soft">Di Tempat</p>
    </div>
  );
}

export function GuestAddress() {
  const name = useGuestName();
  return <GuestAddressView name={name} />;
}

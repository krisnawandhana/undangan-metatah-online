"use client";

import { useGuestName } from "@/hooks/useGuestName";

export const GUEST_FALLBACK = "Bapak/Ibu/Saudara/i";

/** Pure view — also used as the Suspense fallback before the URL is read. */
export function GuestGreetingView({ name }: { name: string | null }) {
  return (
    <div className="relative mx-auto w-full max-w-[21rem] border border-line bg-ivory/85 px-6 py-5 backdrop-blur-[2px]">
      <p className="text-[0.8125rem] text-brown-soft">Kepada Yth.</p>
      {name ? (
        <>
          <p className="mt-1 text-[0.8125rem] text-brown-soft">{GUEST_FALLBACK}</p>
          <p className="mt-2 font-serif text-[1.75rem] leading-tight font-medium break-words">
            {name}
          </p>
        </>
      ) : (
        <p className="mt-2 font-serif text-[1.75rem] leading-tight font-medium">{GUEST_FALLBACK}</p>
      )}
      <p className="mt-2 text-[0.8125rem] text-brown-soft">Di Tempat</p>
    </div>
  );
}

export function GuestGreeting() {
  const name = useGuestName();
  return <GuestGreetingView name={name} />;
}

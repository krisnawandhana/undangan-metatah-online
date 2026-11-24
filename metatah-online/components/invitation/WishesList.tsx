"use client";

import { useEffect, useRef, useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { MOTION, loadGsap } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Wish } from "@/types/rsvp";

export type WishesState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; wishes: Wish[] };

const PAGE = 5;

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Makassar",
});

type Props = { state: WishesState; onRetry: () => void };

export function WishesList({ state, onRetry }: Props) {
  const [visible, setVisible] = useState(PAGE);
  const listRef = useRef<HTMLUListElement>(null);
  const reverts = useRef<Array<() => void>>([]);

  // Stagger in only cards that haven't been shown yet (initial load,
  // "show more", or a freshly submitted wish at the top).
  useEffect(() => {
    const list = listRef.current;
    if (state.status !== "ready" || !list) return;
    const fresh = Array.from(list.querySelectorAll<HTMLElement>("[data-wish]:not([data-shown])"));
    fresh.forEach((el) => el.setAttribute("data-shown", ""));

    let cancelled = false;
    loadGsap()
      .then(({ gsap, ScrollTrigger }) => {
        if (cancelled) return;
        // The list replaced a skeleton of a different height.
        ScrollTrigger.refresh();
        if (fresh.length === 0) return;
        const ctx = gsap.context(() => {
          gsap.matchMedia().add(MOTION.ok, () => {
            gsap.from(fresh, {
              autoAlpha: 0,
              y: 16,
              duration: 0.6,
              stagger: 0.08,
              scrollTrigger: { trigger: list, start: "top 88%", once: true },
            });
          });
        });
        reverts.current.push(() => ctx.revert());
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [state, visible]);

  useEffect(() => {
    const list = reverts.current;
    return () => list.forEach((revert) => revert());
  }, []);

  return (
    <section aria-labelledby="ucapan-title" aria-busy={state.status === "loading"}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-brown/15 pb-4">
        <h3 id="ucapan-title" className="text-[1.75rem] leading-tight font-medium">
          Ucapan &amp; Doa Restu
        </h3>
        {state.status === "ready" && state.wishes.length > 0 && <Summary wishes={state.wishes} />}
      </div>

      {state.status === "loading" && (
        <ul className="mt-6 space-y-4" aria-label="Memuat ucapan">
          {[0, 1, 2].map((i) => (
            <li key={i} className="bg-ivory/70 p-6 motion-safe:animate-pulse">
              <div className="h-4 w-40 bg-cream-deep" />
              <div className="mt-4 h-3 w-full bg-cream-deep/70" />
              <div className="mt-2 h-3 w-2/3 bg-cream-deep/70" />
            </li>
          ))}
        </ul>
      )}

      {state.status === "error" && (
        <div role="alert" className="mt-6 bg-ivory/70 px-6 py-8 text-center">
          <p className="text-brown-soft">Ucapan belum dapat dimuat saat ini.</p>
          <PrimaryButton variant="outline" className="mt-5" onClick={onRetry}>
            Coba lagi
          </PrimaryButton>
        </div>
      )}

      {state.status === "ready" && state.wishes.length === 0 && (
        <p className="mt-6 bg-ivory/70 px-6 py-10 text-center font-serif text-xl text-brown-soft italic">
          Belum ada ucapan. Jadilah yang pertama mengirimkan doa restu.
        </p>
      )}

      {state.status === "ready" && state.wishes.length > 0 && (
        <>
          <ul ref={listRef} className="mt-6 space-y-4">
            {state.wishes.slice(0, visible).map((wish) => (
              <WishCard key={wish.id} wish={wish} />
            ))}
          </ul>
          {state.wishes.length > visible && (
            <div className="mt-8 text-center">
              <PrimaryButton variant="outline" onClick={() => setVisible((v) => v + PAGE)}>
                Tampilkan ucapan lainnya
              </PrimaryButton>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function Summary({ wishes }: { wishes: Wish[] }) {
  const attending = wishes.filter((w) => w.attendance === "hadir").length;
  return (
    <p className="numerals text-sm text-brown-soft">
      {wishes.length} ucapan · {attending} hadir
    </p>
  );
}

function WishCard({ wish }: { wish: Wish }) {
  const attending = wish.attendance === "hadir";
  return (
    <li data-wish className="bg-ivory px-6 py-6 sm:px-7">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <p className="font-bold break-words">{wish.name}</p>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.08em] uppercase",
            attending ? "text-sage-ink" : "text-terracotta-ink",
          )}
        >
          <span aria-hidden="true" className={cn("size-1.5 rounded-full", attending ? "bg-sage" : "bg-terracotta")} />
          {attending ? `Hadir${wish.guests ? ` · ${wish.guests} orang` : ""}` : "Tidak dapat hadir"}
        </span>
      </div>
      <p className="mt-3 font-serif text-[1.1875rem] leading-relaxed whitespace-pre-line break-words">
        {wish.message}
      </p>
      <time dateTime={wish.createdAt} className="mt-3 block text-[0.8125rem] text-brown-soft">
        {dateFormat.format(new Date(wish.createdAt))}
      </time>
    </li>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { RSVPForm } from "@/components/invitation/RSVPForm";
import { WishesList, type WishesState } from "@/components/invitation/WishesList";
import { useGuestName } from "@/hooks/useGuestName";
import { listWishes } from "@/lib/rsvp-client";

/** Owns the wishes data so the list can refresh after a submission. */
export function RSVPPanel() {
  const guestName = useGuestName();
  const [wishes, setWishes] = useState<WishesState>({ status: "loading" });

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const items = await listWishes(signal);
      setWishes({ status: "ready", wishes: items });
    } catch {
      if (!signal?.aborted) setWishes({ status: "error" });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    listWishes(controller.signal)
      .then((items) => setWishes({ status: "ready", wishes: items }))
      .catch(() => {
        if (!controller.signal.aborted) setWishes({ status: "error" });
      });
    return () => controller.abort();
  }, []);

  const retry = () => {
    setWishes({ status: "loading" });
    void load();
  };

  return (
    <div className="mx-auto max-w-[38rem]">
      <RSVPForm defaultName={guestName ?? ""} onSubmitted={() => void load()} />
      <div className="mt-20">
        <WishesList state={wishes} onRetry={retry} />
      </div>
    </div>
  );
}

export function RSVPPanelSkeleton() {
  return (
    <div className="mx-auto max-w-[38rem]" aria-hidden="true">
      <div className="h-[34rem] bg-ivory/70" />
    </div>
  );
}

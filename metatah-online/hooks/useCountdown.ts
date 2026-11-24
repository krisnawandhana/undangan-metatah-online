"use client";

import { useCallback, useSyncExternalStore } from "react";

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

/** Pure split of the remaining time; both arguments are epoch seconds. */
export function getCountdownParts(targetSec: number, nowSec: number): CountdownParts {
  const remaining = Math.max(0, targetSec - nowSec);
  return {
    days: Math.floor(remaining / 86400),
    hours: Math.floor((remaining % 86400) / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    seconds: remaining % 60,
    done: remaining === 0,
  };
}

const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => null;

/**
 * Ticks once per second against an absolute timestamp, so the result does
 * not depend on the guest's timezone. Returns null during server render and
 * hydration, then the live value. Stops ticking once the target is reached.
 */
export function useCountdown(targetMs: number): CountdownParts | null {
  const targetSec = Math.floor(targetMs / 1000);

  const subscribe = useCallback(
    (onTick: () => void) => {
      if (getSnapshot() >= targetSec) return () => {};
      const id = window.setInterval(() => {
        onTick();
        if (getSnapshot() >= targetSec) window.clearInterval(id);
      }, 1000);
      return () => window.clearInterval(id);
    },
    [targetSec],
  );

  const nowSec = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return nowSec === null ? null : getCountdownParts(targetSec, nowSec);
}

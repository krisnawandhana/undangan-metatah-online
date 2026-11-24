"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TARGET_VOLUME = 0.5;
const FADE_MS = 2500;

/** Linear volume ramp; returns a cancel function. iOS ignores volume, harmlessly. */
function fadeIn(audio: HTMLAudioElement, to: number, ms: number): () => void {
  const start = performance.now();
  let frame = 0;
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    audio.volume = to * t;
    if (t < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}

/**
 * Background music that only ever starts from a user gesture.
 * `start()` must be called synchronously inside a click handler, otherwise
 * mobile browsers block playback. The file is not requested before that.
 */
export function useBackgroundMusic(src: string, enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pausedByVisibility = useRef(false);
  const cancelFade = useRef<() => void>(() => {});
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const play = useCallback(async (fade: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (fade) audio.volume = 0;
      await audio.play();
      setPlaying(true);
      if (fade) cancelFade.current = fadeIn(audio, TARGET_VOLUME, FADE_MS);
    } catch {
      // Missing file, unsupported codec, or the browser refused playback.
      setPlaying(false);
      setFailed(true);
    }
  }, []);

  const start = useCallback(() => {
    if (!enabled || audioRef.current) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.addEventListener("error", () => {
      setFailed(true);
      setPlaying(false);
    });
    audioRef.current = audio;
    void play(true);
  }, [enabled, src, play]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = TARGET_VOLUME;
      void play(false);
    } else {
      cancelFade.current();
      audio.pause();
      setPlaying(false);
    }
  }, [play]);

  // Pause while the tab is hidden; resume only if we were the ones pausing.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden && !audio.paused) {
        pausedByVisibility.current = true;
        audio.pause();
      } else if (!document.hidden && pausedByVisibility.current) {
        pausedByVisibility.current = false;
        void audio.play().catch(() => setPlaying(false));
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(
    () => () => {
      const audio = audioRef.current;
      cancelFade.current();
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    },
    [],
  );

  return { start, toggle, playing, available: enabled && !failed };
}

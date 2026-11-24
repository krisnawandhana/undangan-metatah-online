"use client";

/**
 * GSAP runtime chunk. Do not import this statically from components —
 * go through `loadGsap()` in `lib/motion.ts` so it stays out of the
 * initial bundle.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power2.out", duration: 0.8 });

export { gsap, ScrollTrigger };

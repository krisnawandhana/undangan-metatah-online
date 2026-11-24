import { cn } from "@/lib/utils";

/**
 * A penjor: a tall bamboo pole whose top arches over, dressed with janur
 * (young coconut leaf) fringes, a sampian at the tip, a hanging tamiang and
 * rice bundle, and a small sanggah shrine with a lamak panel near the base.
 * Drawn leaning right; `mirror` flips it to lean left.
 */

// Arch of the pole, as a cubic Bézier (viewBox units).
const P0 = [70, 300] as const;
const P1 = [70, 150] as const;
const P2 = [150, 30] as const;
const P3 = [215, 90] as const;

function onArch(t: number): [number, number] {
  const u = 1 - t;
  const x = u ** 3 * P0[0] + 3 * u * u * t * P1[0] + 3 * u * t * t * P2[0] + t ** 3 * P3[0];
  const y = u ** 3 * P0[1] + 3 * u * u * t * P1[1] + 3 * u * t * t * P2[1] + t ** 3 * P3[1];
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

// Janur fringe hanging along the arch, longer towards the tip.
const FRINGE = Array.from({ length: 11 }, (_, i) => {
  const t = 0.12 + i * 0.08;
  const [x, y] = onArch(t);
  const len = Math.round(16 + t * 26);
  return `M${x} ${y}q3 ${len / 2} -1 ${len}M${x + 4} ${y + 1}q4 ${len / 2} 1 ${len - 5}`;
}).join("");

const [tx, ty] = onArch(0.42); // tamiang
const [px, py] = onArch(0.66); // rice bundle

export function Penjor({ mirror, className }: { mirror?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 240 800"
      aria-hidden="true"
      focusable="false"
      className={cn(mirror && "-scale-x-100", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Bamboo pole with its nodes */}
      <path d={`M70 800V${P0[1]}C${P1} ${P2} ${P3}`} strokeWidth="2.6" />
      <path
        d="M66 740h8M66 676h8M66 612h8M66 450h8M66 388h8M66 326h8"
        strokeWidth="1.4"
        opacity="0.8"
      />

      {/* Janur fringe along the arch */}
      <path d={FRINGE} strokeWidth="1" opacity="0.75" />

      {/* Sampian at the tip */}
      <g strokeWidth="1.2">
        <path d={`M${P3[0]} ${P3[1]}v18`} />
        <path d="M215 108c-15 6-17 28 0 44 17-16 15-38 0-44z" className="fill-cream" />
        <path d="M215 116c-7 5-8 17 0 26 8-9 7-21 0-26" opacity="0.7" />
        <path d="M208 150q-2 14-6 26M215 152v30M222 150q2 14 6 26" opacity="0.8" />
      </g>

      {/* Tamiang: round woven disc */}
      <g strokeWidth="1.1">
        <path d={`M${tx} ${ty}v18`} />
        <circle cx={tx} cy={ty + 31} r="13" className="fill-cream" />
        <circle cx={tx} cy={ty + 31} r="5" />
        <path
          opacity="0.7"
          d={Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            const c = Math.cos(a);
            const s = Math.sin(a);
            const r = (n: number) => Math.round(n * 10) / 10;
            return `M${r(tx + c * 5)} ${r(ty + 31 + s * 5)}L${r(tx + c * 13)} ${r(ty + 31 + s * 13)}`;
          }).join("")}
        />
      </g>

      {/* Bundle of rice stalks */}
      <g strokeWidth="1.1">
        <path d={`M${px} ${py}v14`} />
        <path d={`M${px} ${py + 14}c-7 8-7 22 0 30 7-8 7-22 0-30z`} className="fill-cream" />
        <path
          d={`M${px - 3} ${py + 22}l-3 3M${px + 3} ${py + 22}l3 3M${px - 3} ${py + 30}l-3 3M${px + 3} ${py + 30}l3 3`}
          opacity="0.7"
        />
      </g>

      {/* Sanggah: small shrine tied to the pole */}
      <g strokeWidth="1.3">
        <path d="M58 506 90 486l32 20z" className="fill-cream" />
        <rect x="70" y="506" width="40" height="22" className="fill-cream" />
        <path d="M78 512h24M70 528h40M74 506v22M106 506v22" opacity="0.7" />
        <path d="M70 548l20-20" opacity="0.6" />
      </g>

      {/* Lamak: long hanging panel below the shrine */}
      <g strokeWidth="1.1">
        <path d="M76 530h28v140l-14 16-14-16z" className="fill-ivory" />
        <path
          opacity="0.75"
          d="M90 548l6 8-6 8-6-8zM90 584l6 8-6 8-6-8zM90 620l6 8-6 8-6-8zM80 572h20M80 608h20M80 644h20"
        />
        <path d="M80 690l-2 12M90 688v16M100 690l2 12" opacity="0.7" />
      </g>

      {/* Ground */}
      <path d="M30 799q40-14 80 0" strokeWidth="1.2" opacity="0.7" />
    </svg>
  );
}

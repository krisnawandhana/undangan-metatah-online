import { cn } from "@/lib/utils";

/**
 * Canang sari seen from above, set as a diamond so each flower points to a
 * compass direction, following the Dewata Nawa Sanga colours:
 * north (top) blue/violet, east (right) white, south (bottom) red,
 * west (left) yellow — softened into the invitation palette.
 * Shredded pandan (rampe) and the porosan sit at the centre.
 */

const r1 = (n: number) => Math.round(n * 10) / 10;

const PETAL = "M0 0C-6-6-7-16-1-19 5-17 6-7 0 0Z";

type Flower = { x: number; y: number; fill: string; spin: number };

const FLOWERS: Flower[] = [
  { x: 100, y: 60, fill: "fill-[#9a8193]/45", spin: 0 }, // north — blue/violet
  { x: 140, y: 100, fill: "fill-ivory", spin: 18 }, // east — white
  { x: 100, y: 140, fill: "fill-terracotta/45", spin: 36 }, // south — red
  { x: 60, y: 100, fill: "fill-gold/55", spin: 54 }, // west — yellow
];

function Frangipani({ x, y, fill, spin }: Flower) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={PETAL} transform={`rotate(${spin + i * 72})`} className={fill} />
      ))}
      <circle r="2.6" className="fill-gold" stroke="none" />
    </g>
  );
}

// Janur wall: two nested squares rotated into a diamond, pinned with semat.
const WALL_OUT = "M100 22 178 100 100 178 22 100Z";
const WALL_IN = "M100 33 167 100 100 167 33 100Z";
const SEMAT = [
  [61, 61],
  [139, 61],
  [139, 139],
  [61, 139],
]
  .map(([x, y]) => {
    // short stitch across the wall, perpendicular to the edge
    const dx = x < 100 ? -1 : 1;
    const dy = y < 100 ? -1 : 1;
    return `M${x - dx * 2} ${y - dy * 2}l${dx * 7} ${dy * 7}`;
  })
  .join("");

const RAMPE = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 + 0.15;
  const outer = i % 2 ? 13 : 17;
  return `M${r1(100 + Math.cos(a) * 5)} ${r1(100 + Math.sin(a) * 5)}L${r1(100 + Math.cos(a) * outer)} ${r1(100 + Math.sin(a) * outer)}`;
}).join("");

export function CanangSari({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
      className={cn("h-28 w-28", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.1"
    >
      <path d={WALL_OUT} className="fill-cream/70" strokeWidth="1.3" />
      <path d={WALL_IN} className="fill-ivory/70" opacity="0.8" />
      <path d={SEMAT} strokeWidth="1.2" opacity="0.8" />

      {FLOWERS.map((f) => (
        <Frangipani key={`${f.x}-${f.y}`} {...f} />
      ))}

      {/* Loose petals between the directions */}
      <g opacity="0.85">
        <circle cx="124" cy="76" r="3" className="fill-ivory" />
        <circle cx="124" cy="124" r="3" className="fill-terracotta/40" />
        <circle cx="76" cy="124" r="3" className="fill-gold/50" />
        <circle cx="76" cy="76" r="3" className="fill-[#9a8193]/40" />
      </g>

      <path d={RAMPE} opacity="0.8" />
      <circle cx="100" cy="100" r="4.5" className="fill-sage/50" />
    </svg>
  );
}

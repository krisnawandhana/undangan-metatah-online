import { cn } from "@/lib/utils";

type Props = {
  side: "left" | "right";
  className?: string;
};

/**
 * One half of a candi bentar (split gate). Drawn as the left half with the
 * flat, cut inner face on the right; the right half is a mirror.
 */
export function CandiBentar({ side, className }: Props) {
  return (
    <svg
      viewBox="0 0 200 640"
      aria-hidden="true"
      focusable="false"
      className={cn(side === "right" && "-scale-x-100", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinejoin="round"
    >
      {/* Silhouette */}
      <path
        className="fill-cream/70"
        d="M200 640H0v-30h14v-90H4v-20h20v-70H14v-12h26v-62H30v-10h28v-54h-8v-8h26v-46h-6v-7h24v-39h-4v-6h22v-34h-4v-5h20v-27c18-6 30-20 38-36 8-15 20-30 34-44z"
      />
      {/* Inner contour, a hand-width inside the silhouette */}
      <path
        opacity="0.55"
        d="M192 632H8v-16h14v-102h-10v-6h20v-82h-10v-4h26v-66H38v-4h28v-58h-8v-3h26v-50h-6v-2h24v-43h-4v-2h22v-38h-4v-1h20v-28c14-6 26-18 34-33 6-12 14-22 26-35"
      />
      {/* Relief panel at the base */}
      <rect x="40" y="532" width="132" height="64" opacity="0.7" />
      <path
        opacity="0.7"
        d="M106 548c10 0 16 6 16 14s-6 12-12 12-9-4-9-8 3-6 6-6M106 548c-10 0-16 6-16 14s6 12 12 12 9-4 9-8-3-6-6-6"
      />
      {/* Carved rosettes on each tier */}
      {[
        [112, 466, 9],
        [120, 388, 8],
        [128, 318, 7],
        [138, 262, 6],
        [148, 212, 5],
        [158, 168, 4],
      ].map(([cx, cy, r]) => (
        <g key={cy} opacity="0.75">
          <circle cx={cx} cy={cy} r={r} />
          <circle cx={cx} cy={cy} r={r / 3} />
        </g>
      ))}
      {/* Finial line on the cut face */}
      <path opacity="0.5" d="M186 60v560" strokeDasharray="2 6" />
    </svg>
  );
}

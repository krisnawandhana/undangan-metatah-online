import { cn } from "@/lib/utils";

type Props = { className?: string };

const svgProps = {
  "aria-hidden": true,
  focusable: false,
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Thin rule with curling tendrils and a lotus bud at the centre. */
export function PatraDivider({ className }: Props) {
  const half = (
    <>
      <path d="M0 12h82" />
      <path d="M82 12c8 0 12-7 18-6 5 1 5 7 1 8-3 1-5-2-3-4" />
      <path d="M88 12c6 4 12 6 18 3" opacity="0.7" />
    </>
  );
  return (
    <svg viewBox="0 0 240 24" className={cn("h-4 w-48", className)} strokeWidth="1" {...svgProps}>
      {half}
      <g transform="translate(240 0) scale(-1 1)">{half}</g>
      <path d="M120 2c4 5 8 8 14 10-6 2-10 5-14 10-4-5-8-8-14-10 6-2 10-5 14-10z" />
      <circle cx="120" cy="12" r="2.5" />
    </svg>
  );
}

/** Symmetric flourish with a central flame (murdha) and curling patra. */
export function PatraFlourish({ className }: Props) {
  const half = (
    <>
      <path d="M74 50c-12 4-24 0-28-10s6-18 14-12c6 4 2 12-4 10" />
      <path d="M76 56c-16 10-38 10-52 0-10-7-6-18 4-16 8 2 6 12-2 10" />
      <path d="M70 61c-6 10-18 14-30 12" opacity="0.7" />
      <path d="M66 44c-4-6-4-12 0-18" opacity="0.6" />
      <circle cx="14" cy="62" r="1.5" />
    </>
  );
  return (
    <svg viewBox="0 0 160 80" className={cn("h-16 w-32", className)} strokeWidth="1.1" {...svgProps}>
      {half}
      <g transform="translate(160 0) scale(-1 1)">{half}</g>
      <path d="M80 6c6 12 12 20 8 32-2 6-6 8-8 14-2-6-6-8-8-14-4-12 2-20 8-32z" />
      <path d="M80 22c3 7 4 12 0 20-4-8-3-13 0-20z" opacity="0.7" />
      <path d="M58 72h44" opacity="0.6" />
    </svg>
  );
}

/** Corner bracket with a single spiral; rotate for the other corners. */
export function PatraCorner({ className }: Props) {
  return (
    <svg viewBox="0 0 80 80" className={cn("h-12 w-12", className)} strokeWidth="1" {...svgProps}>
      <path d="M2 78V22C2 11 11 2 22 2h56" />
      <path d="M14 46c0-18 14-32 32-32 10 0 14 10 8 16-4 4-10 0-8-4" />
      <path d="M20 58c4-8 4-16 0-22" opacity="0.6" />
      <path d="M58 20c-8-4-16-4-22 0" opacity="0.6" />
      <circle cx="10" cy="10" r="2" />
    </svg>
  );
}

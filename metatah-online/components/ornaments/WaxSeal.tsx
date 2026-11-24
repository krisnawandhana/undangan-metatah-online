import { cn } from "@/lib/utils";

const r1 = (n: number) => Math.round(n * 10) / 10;

// Slightly irregular rim, like pressed wax (deterministic, no randomness).
const RIM = (() => {
  const n = 22;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = 30 + (i % 2 ? 1.4 : -0.6) + Math.sin(i * 1.7) * 1.1;
    return `${r1(32 + Math.cos(a) * r)} ${r1(32 + Math.sin(a) * r)}`;
  });
  return `M${pts.join("L")}Z`;
})();

/** Terracotta wax seal pressed with a murdha (flame) motif. */
export function WaxSeal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={cn("drop-shadow-[0_3px_6px_rgb(73_56_46/0.35)]", className)}
    >
      <defs>
        <radialGradient id="wax" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#b86d52" />
          <stop offset="70%" stopColor="#a65f46" />
          <stop offset="100%" stopColor="#8f4f39" />
        </radialGradient>
      </defs>
      <path d={RIM} fill="url(#wax)" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#c9b184" strokeWidth="0.9" strokeDasharray="1.5 2.2" />
      <g fill="none" stroke="#e9d9b8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 16c3.5 7 7 11 5 18-1 3.5-3.5 4.5-5 8.5-1.5-4-4-5-5-8.5-2-7 1.5-11 5-18z" />
        <path d="M32 25c1.8 3.6 2.2 6.4 0 10.4-2.2-4-1.8-6.8 0-10.4z" opacity="0.8" />
        <path d="M24 46h16" opacity="0.8" />
      </g>
    </svg>
  );
}

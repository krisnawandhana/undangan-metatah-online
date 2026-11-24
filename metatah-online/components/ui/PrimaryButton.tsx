import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "outline-light";
type Size = "default" | "caps";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2.5 font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const sizes: Record<Size, string> = {
  default: "px-6 text-[0.9375rem] tracking-[0.01em]",
  caps: "px-9 text-[0.8125rem] tracking-[0.22em] uppercase",
};

const variants: Record<Variant, string> = {
  solid:
    "bg-brown text-ivory outline outline-1 outline-offset-[3px] outline-brown/40 hover:bg-[#3a2c24]",
  outline: "border border-brown/40 text-brown hover:border-brown hover:bg-brown/5",
  "outline-light": "border border-gold/60 text-ivory hover:border-gold hover:bg-ivory/5",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function PrimaryButton({
  variant = "solid",
  size = "default",
  className,
  children,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function PrimaryLink({
  variant = "solid",
  size = "default",
  className,
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </a>
  );
}

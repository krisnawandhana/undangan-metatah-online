import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "ivory" | "cream" | "brown";

const toneClass: Record<Tone, string> = {
  ivory: "bg-ivory text-brown",
  cream: "bg-cream text-brown",
  brown: "bg-brown text-ivory",
};

type SectionProps = {
  id: string;
  tone?: Tone;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
};

export function Section({ id, tone = "ivory", labelledBy, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative isolate py-24 sm:py-32", toneClass[tone], className)}
    >
      {children}
    </section>
  );
}

type ContainerProps = {
  size?: "wide" | "text";
  className?: string;
  children: ReactNode;
};

/** wide ≈ 1100px for layouts, text ≈ 640px for reading. */
export function Container({ size = "wide", className, children }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        size === "wide" ? "max-w-[1100px]" : "max-w-[40rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}

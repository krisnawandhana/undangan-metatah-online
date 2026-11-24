import type { ReactNode } from "react";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  onDark?: boolean;
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, children, onDark, className }: Props) {
  return (
    <header data-reveal className={cn("mx-auto max-w-[36rem] text-center", className)}>
      {eyebrow && (
        <p className={cn("eyebrow mb-5", onDark ? "text-gold-light" : "text-terracotta-ink")}>
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="text-[2.5rem] leading-[1.05] font-medium sm:text-[3.25rem]"
      >
        {title}
      </h2>
      <DecorativeDivider className="mt-6" />
      {children && (
        <div
          className={cn(
            "mt-6 font-serif text-xl leading-relaxed italic",
            onDark ? "text-ivory/80" : "text-brown-soft",
          )}
        >
          {children}
        </div>
      )}
    </header>
  );
}

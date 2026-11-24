import { PatraDivider } from "@/components/ornaments/Patra";
import { cn } from "@/lib/utils";

export function DecorativeDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center text-gold", className)}>
      <PatraDivider />
    </div>
  );
}

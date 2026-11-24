import { ParticipantCard } from "@/components/invitation/ParticipantCard";
import { Container, Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { InvitationData } from "@/types/invitation";

type Props = Pick<InvitationData, "participants" | "family">;

export function ParticipantSection({ participants, family }: Props) {
  const count = participants.length;

  return (
    <Section id="peserta" tone="cream" labelledBy="peserta-title">
      <Container>
        <SectionHeading id="peserta-title" eyebrow="Peserta Upacara" title="Mereka yang Berbahagia" />

        <div
          className={cn(
            "mx-auto mt-16 grid gap-x-10 gap-y-20 sm:mt-20",
            count === 1 && "max-w-[22rem]",
            count === 2 && "max-w-[46rem] sm:grid-cols-2",
            count >= 3 && "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {participants.map((p, i) => (
            <ParticipantCard key={p.name} index={i} participant={p} parents={p.parents ?? family} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

import { Suspense } from "react";
import { RSVPPanel, RSVPPanelSkeleton } from "@/components/invitation/RSVPPanel";
import { Container, Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function RSVPSection({ subtitle }: { subtitle: string }) {
  return (
    <Section id="rsvp" tone="cream" labelledBy="rsvp-title">
      <Container>
        <SectionHeading id="rsvp-title" eyebrow="RSVP" title="Konfirmasi Kehadiran">
          <p>{subtitle}</p>
        </SectionHeading>
        <div data-reveal className="mt-14 sm:mt-16">
          {/* The panel reads ?to= to prefill the name, so it needs a Suspense boundary. */}
          <Suspense fallback={<RSVPPanelSkeleton />}>
            <RSVPPanel />
          </Suspense>
        </div>
      </Container>
    </Section>
  );
}

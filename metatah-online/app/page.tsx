import { ClosingSection } from "@/components/invitation/ClosingSection";
import { EventDetailsSection } from "@/components/invitation/EventDetailsSection";
import { GallerySection } from "@/components/invitation/GallerySection";
import { GreetingSection } from "@/components/invitation/GreetingSection";
import { InvitationShell } from "@/components/invitation/InvitationShell";
import { ParticipantSection } from "@/components/invitation/ParticipantSection";
import { RSVPSection } from "@/components/invitation/RSVPSection";
import { invitationData as data } from "@/data/invitation";
import { formatEventDate, getEventStart } from "@/lib/datetime";

export default function InvitationPage() {
  const { event, participants, family, copy, gallery, music } = data;

  return (
    <InvitationShell
      music={music}
      cover={{
        eyebrow: "Upacara Manusa Yadnya",
        title: "Metatah",
        altTitle: "Mepandes",
        names: participants.map((p) => p.nickname).join(" & "),
        dateLabel: formatEventDate(event),
        dateTime: getEventStart(event).toISOString(),
      }}
    >
      <GreetingSection copy={copy} />
      <ParticipantSection participants={participants} family={family} />
      <EventDetailsSection data={data} />
      <GallerySection images={gallery} subtitle={copy.gallerySubtitle} />
      <RSVPSection subtitle={copy.rsvpSubtitle} />
      <ClosingSection copy={copy} family={family} />
    </InvitationShell>
  );
}

import { Countdown } from "@/components/invitation/Countdown";
import { EventMap } from "@/components/invitation/EventMap";
import { PatraCorner } from "@/components/ornaments/Patra";
import { CalendarPlus, Clock, MapPin, Navigation } from "@/components/ui/icons";
import { PrimaryLink } from "@/components/ui/PrimaryButton";
import { Container, Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildGoogleCalendarUrl } from "@/lib/calendar";
import { formatEventDate, formatEventTime, getEventStart } from "@/lib/datetime";
import { buildDirectionsUrl, buildEmbedUrl } from "@/lib/maps";
import type { InvitationData } from "@/types/invitation";

type Props = { data: InvitationData };

export function EventDetailsSection({ data }: Props) {
  const { event, venue } = data;
  const start = getEventStart(event);

  return (
    <Section id="acara" tone="brown" labelledBy="acara-title">
      <Container>
        <SectionHeading id="acara-title" eyebrow="Hari yang Dinanti" title="Waktu & Tempat" onDark />

        <div data-reveal className="mt-14 sm:mt-16">
          <Countdown targetMs={start.getTime()} />
        </div>

        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
          {/* Event card */}
          <div data-reveal data-reveal-delay="0.1" className="relative bg-ivory px-6 py-12 text-brown sm:px-12 sm:py-14">
            <PatraCorner className="absolute top-3 left-3 h-10 w-10 text-gold" />
            <PatraCorner className="absolute top-3 right-3 h-10 w-10 rotate-90 text-gold" />
            <PatraCorner className="absolute right-3 bottom-3 h-10 w-10 rotate-180 text-gold" />
            <PatraCorner className="absolute bottom-3 left-3 h-10 w-10 -rotate-90 text-gold" />

            <div className="text-center">
              <h3 className="mx-auto max-w-[22rem] text-[1.75rem] leading-tight font-medium sm:text-[2rem]">
                {event.ceremony}
              </h3>

              <p className="mt-8 font-serif text-[1.625rem] leading-tight italic sm:text-3xl">
                <time dateTime={start.toISOString()}>{formatEventDate(event)}</time>
              </p>

              <p className="mt-3 inline-flex items-center gap-2 text-brown-soft">
                <Clock size={16} className="text-gold-ink" />
                Pukul {formatEventTime(event.startTime)} {event.timezoneLabel} – Selesai
              </p>

              <div className="mx-auto my-8 h-px w-16 bg-gold" aria-hidden="true" />

              <address className="not-italic">
                <p className="inline-flex items-center gap-2 font-bold">
                  <MapPin size={16} className="shrink-0 text-gold-ink" />
                  {venue.name}
                </p>
                <p className="mx-auto mt-2 max-w-[24rem] text-[0.9375rem] leading-relaxed text-brown-soft">
                  {venue.address}
                </p>
              </address>

              <div data-reveal="fade" data-reveal-delay="0.4" className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center [&>a]:sm:whitespace-nowrap">
                <PrimaryLink href={buildGoogleCalendarUrl(data)} target="_blank" rel="noopener noreferrer">
                  <CalendarPlus size={17} />
                  Simpan ke Google Calendar
                  <span className="sr-only">(membuka tab baru)</span>
                </PrimaryLink>
                <PrimaryLink
                  variant="outline"
                  href={buildDirectionsUrl(venue)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation size={16} />
                  Buka Petunjuk Arah
                  <span className="sr-only">(membuka tab baru)</span>
                </PrimaryLink>
              </div>
            </div>
          </div>

          <div data-reveal data-reveal-delay="0.3">
            <EventMap embedUrl={buildEmbedUrl(venue)} venueName={venue.name} />
          </div>
        </div>
      </Container>
    </Section>
  );
}

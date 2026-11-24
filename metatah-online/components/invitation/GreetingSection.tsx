import { PatraFlourish } from "@/components/ornaments/Patra";
import { DecorativeDivider } from "@/components/ui/DecorativeDivider";
import { Container, Section } from "@/components/ui/Section";
import type { InvitationData } from "@/types/invitation";

type Props = { copy: InvitationData["copy"] };

export function GreetingSection({ copy }: Props) {
  return (
    <Section id="salam" labelledBy="salam-title" className="pt-28 sm:pt-36">
      <Container size="text" className="text-center">
        {/* First thing seen after the gate opens: plays as one sequence. */}
        <div data-reveal-sequence data-reveal-delay="0.15">
          <div data-reveal-step>
            <PatraFlourish className="mx-auto h-14 w-28 text-gold sm:h-16 sm:w-32" />
          </div>

          <h2
            id="salam-title"
            data-reveal-step
            className="mt-8 text-[3rem] leading-none font-normal italic sm:text-[4rem]"
          >
            {copy.greeting}
          </h2>

          <p
            data-reveal-step
            className="mt-10 font-serif text-[1.3125rem] leading-[1.65] sm:text-2xl sm:leading-[1.6]"
          >
            {copy.introduction}
          </p>
        </div>

        <div data-reveal="fade">
          <DecorativeDivider className="my-14" />
        </div>

        <div data-reveal>
          <h3 className="eyebrow text-terracotta-ink">{copy.philosophyTitle}</h3>
          <p className="mt-5 text-brown-soft">{copy.philosophy}</p>
        </div>

        <ul
          data-reveal-stagger
          aria-label="Sad Ripu, enam sifat buruk manusia"
          className="mt-10 grid grid-cols-2 border-t border-l border-line sm:grid-cols-3"
        >
          {copy.sadRipu.map((item, i) => (
            <li key={item.name} data-reveal-item className="border-r border-b border-line px-3 py-5">
              <span className="numerals block text-[0.6875rem] tracking-[0.2em] text-gold-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-1 block font-serif text-2xl leading-tight italic">{item.name}</span>
              <span className="mt-0.5 block text-sm text-brown-soft">{item.meaning}</span>
            </li>
          ))}
        </ul>

        <p
          data-reveal
          className="mx-auto mt-14 max-w-[32rem] font-serif text-xl leading-relaxed text-brown-soft italic"
        >
          {copy.greetingClosing}
        </p>
      </Container>
    </Section>
  );
}

import { PatraFlourish } from "@/components/ornaments/Patra";
import { ArrowUp } from "@/components/ui/icons";
import { Container, Section } from "@/components/ui/Section";
import type { InvitationData } from "@/types/invitation";

type Props = Pick<InvitationData, "copy" | "family">;

export function ClosingSection({ copy, family }: Props) {
  return (
    <Section id="penutup" labelledBy="penutup-title" className="pb-16 sm:pb-20">
      <Container size="text" className="text-center">
        <div data-reveal="fade">
          <PatraFlourish className="mx-auto h-14 w-28 text-gold sm:h-16 sm:w-32" />
        </div>

        <div data-reveal className="mt-10 space-y-5 font-serif text-[1.3125rem] leading-[1.65] sm:text-2xl">
          {copy.closing.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <h2 id="penutup-title" data-reveal className="mt-12 text-[2.25rem] leading-tight font-normal italic sm:text-5xl">
          {copy.blessing}
        </h2>

        <div data-reveal data-reveal-delay="0.25" className="mx-auto mt-14 max-w-[24rem] border-y border-line py-10">
          <p className="text-sm text-brown-soft">Kami yang berbahagia,</p>
          <p className="eyebrow mt-5 text-terracotta-ink">{family.familyName}</p>
          <p className="mt-3 font-serif text-[1.75rem] leading-snug font-medium">
            Bapak {family.father}
            <br />
            <span className="text-gold-ink">&amp;</span> Ibu {family.mother}
          </p>
        </div>

        <a
          href="#top"
          className="mt-16 inline-flex min-h-12 items-center gap-2 px-4 text-sm text-brown-soft transition-colors hover:text-brown"
        >
          <ArrowUp size={16} />
          Kembali ke atas
        </a>
      </Container>
    </Section>
  );
}

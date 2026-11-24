import { PhotoGallery } from "@/components/invitation/PhotoGallery";
import { Container, Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { GalleryImage } from "@/types/invitation";

type Props = { images: GalleryImage[]; subtitle: string };

/** Optional section — renders nothing when the gallery is empty. */
export function GallerySection({ images, subtitle }: Props) {
  if (images.length === 0) return null;

  return (
    <Section id="galeri" labelledBy="galeri-title">
      <Container>
        <SectionHeading id="galeri-title" eyebrow="Galeri" title="Momen Kebersamaan">
          <p>{subtitle}</p>
        </SectionHeading>
        <div className="mt-14 sm:mt-16">
          <PhotoGallery images={images} />
        </div>
      </Container>
    </Section>
  );
}

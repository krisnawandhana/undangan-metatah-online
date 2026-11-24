type Props = {
  embedUrl: string;
  venueName: string;
};

export function EventMap({ embedUrl, venueName }: Props) {
  return (
    <div className="relative h-full min-h-[20rem] overflow-hidden border border-gold/40 bg-cream">
      <iframe
        src={embedUrl}
        title={`Peta lokasi ${venueName}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0 [filter:sepia(0.18)_saturate(0.85)]"
        allowFullScreen
      />
    </div>
  );
}

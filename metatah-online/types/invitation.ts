export type Gender = "putra" | "putri";

export type Parents = {
  father: string;
  mother: string;
};

export type Participant = {
  name: string;
  /** Short name used on the cover, e.g. "Putu Agus". */
  nickname: string;
  gender: Gender;
  birthOrder: number;
  photo?: string;
  message?: string;
  /** Override when a participant has different parents (e.g. a joint ceremony). */
  parents?: Parents;
};

export type GalleryImage = {
  /** Leave empty to render a decorative placeholder until the photo is ready. */
  src?: string;
  alt: string;
  orientation: "portrait" | "landscape" | "square";
};

export type SadRipu = {
  name: string;
  meaning: string;
};

export type InvitationData = {
  /** Stable key that scopes RSVPs in the database. Never change after launch. */
  id: string;
  event: {
    title: string;
    ceremony: string;
    subtitle: string;
    /** YYYY-MM-DD in the venue's local time. */
    date: string;
    /** HH:mm in the venue's local time. */
    startTime: string;
    /** HH:mm in the venue's local time. Used for the calendar entry. */
    endTime: string;
    /** IANA zone of the venue. Bali uses Asia/Makassar (WITA). */
    timezone: string;
    /** Fixed UTC offset of the zone. WITA has no daylight saving. */
    utcOffset: string;
    timezoneLabel: string;
    description: string;
  };
  family: Parents & {
    familyName: string;
  };
  participants: Participant[];
  venue: {
    name: string;
    address: string;
    /** Query used for Google Maps (address or "lat,lng"). */
    mapsQuery: string;
    /** Optional custom embed URL from Google Maps "Share → Embed a map". */
    embedUrl?: string;
  };
  gallery: GalleryImage[];
  music: {
    enabled: boolean;
    src: string;
    title: string;
  };
  copy: {
    greeting: string;
    introduction: string;
    philosophyTitle: string;
    philosophy: string;
    sadRipu: SadRipu[];
    greetingClosing: string;
    rsvpSubtitle: string;
    gallerySubtitle: string;
    closing: string[];
    blessing: string;
  };
};

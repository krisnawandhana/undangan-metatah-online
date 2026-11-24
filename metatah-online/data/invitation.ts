import type { InvitationData } from "@/types/invitation";

/**
 * Single source of truth for the invitation.
 * Every name, date, and place below is sample data — replace it with the
 * family's real details. Components never hardcode any of this.
 */
export const invitationData: InvitationData = {
  id: "metatah-sudarma-2027",
  event: {
    title: "Upacara Manusa Yadnya Metatah",
    ceremony: "Upacara Manusa Yadnya Metatah (Mepandes)",
    subtitle: "Metatah / Mepandes",
    date: "2027-01-15",
    startTime: "09:00",
    endTime: "13:00",
    timezone: "Asia/Makassar",
    utcOffset: "+08:00",
    timezoneLabel: "WITA",
    description:
      "Mohon doa restu pada Upacara Manusa Yadnya Metatah (Mepandes) putra-putri kami.",
  },
  family: {
    familyName: "Keluarga Besar",
    father: "I Wayan Sudarma",
    mother: "Ni Made Sriani",
  },
  participants: [
    {
      name: "I Putu Agus Mahendra",
      nickname: "Putu Agus",
      gender: "putra",
      birthOrder: 1,
      message: "Semoga langkah ini menuntun kami menjadi pribadi yang lebih bijaksana.",
    },
    {
      name: "Ni Kadek Ayu Lestari",
      nickname: "Kadek Ayu",
      gender: "putri",
      birthOrder: 2,
      message: "Terima kasih atas doa dan kehadiran yang menguatkan kami.",
    },
  ],
  venue: {
    name: "Kediaman Keluarga I Wayan Sudarma",
    address:
      "Jl. Raya Peliatan No. 18, Banjar Tegal, Desa Peliatan, Kecamatan Ubud, Kabupaten Gianyar, Bali",
    mapsQuery: "Peliatan, Ubud, Gianyar, Bali",
  },
  // Order matters for the masonry columns: pairing portrait + landscape and
  // square + square keeps the three desktop columns at an even height.
  gallery: [
    { alt: "Potret Putu Agus dengan busana adat Bali", orientation: "portrait" },
    { alt: "Keluarga berkumpul di halaman merajan", orientation: "landscape" },
    { alt: "Potret Kadek Ayu dengan busana adat Bali", orientation: "portrait" },
    { alt: "Kebersamaan kakak dan adik", orientation: "landscape" },
    { alt: "Persiapan banten untuk upacara", orientation: "square" },
    { alt: "Detail ukiran di pintu kori rumah", orientation: "square" },
  ],
  music: {
    enabled: false,
    src: "/audio/balinese-instrumental.mp3",
    title: "Instrumental gamelan Bali",
  },
  copy: {
    greeting: "Om Swastyastu",
    introduction:
      "Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada Upacara Manusa Yadnya Metatah (Mepandes) putra-putri kami.",
    philosophyTitle: "Makna Metatah",
    philosophy:
      "Metatah merupakan tradisi suci dalam kehidupan masyarakat Hindu Bali sebagai simbol pengendalian diri terhadap enam sifat buruk manusia (Sad Ripu), demi menapaki kehidupan yang lebih bijaksana, harmonis, dan penuh kedewasaan.",
    sadRipu: [
      { name: "Kama", meaning: "hawa nafsu" },
      { name: "Lobha", meaning: "keserakahan" },
      { name: "Krodha", meaning: "amarah" },
      { name: "Moha", meaning: "kebingungan" },
      { name: "Mada", meaning: "kemabukan" },
      { name: "Matsarya", meaning: "iri hati" },
    ],
    greetingClosing:
      "Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan turut mendoakan kelancaran upacara ini.",
    rsvpSubtitle:
      "Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
    gallerySubtitle:
      "Beberapa momen dan kenangan yang menjadi bagian dari perjalanan kami.",
    closing: [
      "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.",
      "Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.",
    ],
    blessing: "Om Santih, Santih, Santih Om",
  },
};

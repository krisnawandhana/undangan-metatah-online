Metatah Digital Invitation Website

Product & UI/UX Implementation Brief

1. Project Overview

Build a responsive digital invitation website for a traditional Balinese Hindu tooth-filing ceremony (Upacara Manusa Yadnya Metatah / Mepandes).

The website should serve as a digital invitation where guests can:

* Understand the purpose of the ceremony.
* View the participants’ profiles.
* Access the ceremony date, time, and location.
* Navigate to the event location using Google Maps.
* Save the event to Google Calendar.
* Confirm attendance (RSVP).
* Leave wishes and prayers for the family.

The experience should feel personal, elegant, culturally respectful, and easy to navigate.

Technology Stack

* Framework: Next.js (App Router)
* Language: TypeScript
* Styling: Tailwind CSS
* Animation: GSAP
* Icons: Lucide React
* Database / Backend: Supabase (for RSVP and guest wishes)
* Maps: Google Maps Embed / Google Maps Directions
* Calendar: Google Calendar Event URL

Use reusable React components and maintain a clean, scalable project structure.

⸻

2. Design Direction

Visual Concept

Theme: Elegant Balinese Heritage

Combine traditional Balinese visual elements with contemporary editorial web design.

The design should communicate:

* Sacredness
* Family warmth
* Elegance
* Cultural heritage
* Celebration

Avoid making the website look overly decorative or crowded.

Color Palette

Color	Hex	Usage
Warm Ivory	#F8F5EF	Main background
Cream	#EEE6D8	Secondary background
Deep Brown	#49382E	Primary text
Muted Gold	#B69A65	Accent / decorative elements
Terracotta	#A65F46	Secondary accent
Soft Green	#78816B	Natural accent

Typography

Use a combination of elegant serif typography and readable sans-serif typography.

* Headings: Cormorant Garamond
* Body: Lato
* Decorative text: Cormorant Garamond Italic

Typography should have generous spacing and clear hierarchy.

Visual Assets

Use:

* Balinese traditional ornaments (patra / ukiran Bali).
* Subtle floral illustrations.
* Traditional Balinese architecture.
* Balinese ceremonial photography.
* Decorative borders inspired by traditional Balinese carving.

Decorative elements should be subtle and should never interfere with readability.

⸻

3. Website Structure & Content

The website uses a single-page vertical scrolling layout.

Section 01 — Opening Cover / Hero

Purpose: Introduce the invitation and create the first impression.

Layout:

* Full viewport height (100svh).
* Centered content.
* Decorative Balinese ornament as background detail.
* Main invitation title.
* Event date.
* Guest personalization.
* Opening button.

Content:

Eyebrow
Upacara Manusa Yadnya

Main Heading
Metatah / Mepandes

Participant Name
[Nama Peserta / Nama Keluarga]

Date
[Hari, Tanggal Bulan Tahun]

Guest Greeting
Kepada Yth.
Bapak/Ibu/Saudara/i

[Nama Tamu]

Di Tempat

CTA
Buka Undangan

Interaction:

* Clicking the opening button transitions to the main invitation.
* Trigger background instrumental Balinese music if available.
* Music should be optional and have a mute/unmute control.
* Prevent automatic audio playback before user interaction.
* Animate the cover out smoothly using GSAP.

⸻

Section 02 — Greeting & Introduction

Purpose: Welcome guests and introduce the ceremony.

Layout:

* Centered editorial layout.
* Generous vertical spacing.
* Decorative divider or traditional Balinese ornament.
* Elegant typography.

Content:

Greeting
Om Swastyastu

Introduction

Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada Upacara Manusa Yadnya Metatah (Mepandes) putra-putri kami.

Ceremony Philosophy

Metatah merupakan tradisi suci dalam kehidupan masyarakat Hindu Bali sebagai simbol pengendalian diri terhadap enam sifat buruk manusia (Sad Ripu), demi menapaki kehidupan yang lebih bijaksana, harmonis, dan penuh kedewasaan.

Closing
Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan turut mendoakan kelancaran upacara ini.

⸻

Section 03 — Participant Profile

Purpose: Introduce the person or people participating in the ceremony.

Layout:

* Centered section heading.
* Portrait photography.
* Participant information below each photo.
* If multiple participants exist, use a responsive grid.
* On mobile, stack participant cards vertically.

Content:

Section Heading
Mereka yang Berbahagia

Participant Card

[Nama Lengkap Peserta]

Putra/Putri ke-[Urutan] dari

Bapak [Nama Ayah]
& Ibu [Nama Ibu]

Optional:

* Traditional Balinese clothing portrait.
* Subtle decorative frame.
* Short personal message.

Support multiple participants dynamically.

⸻

Section 04 — Event Details

Purpose: Present all essential ceremony information.

Layout:

* Distinct background section.
* Elegant event information card.
* Countdown timer.
* Calendar and navigation actions.

Content:

Section Heading
Waktu & Tempat

Event Name
Upacara Manusa Yadnya Metatah (Mepandes)

Date
[Hari, Tanggal Bulan Tahun]

Time
[Pukul Mulai] WITA – Selesai

Venue
[Nama Tempat]

[Alamat Lengkap, Banjar, Desa, Kecamatan, Kabupaten]

Countdown Timer

Display:

* Days
* Hours
* Minutes
* Seconds

Countdown should update every second and stop at zero.

Action Buttons

1. Simpan ke Google Calendar
2. Buka Petunjuk Arah

Google Calendar:
Generate an event URL containing:

* Event title
* Start and end date/time
* Venue
* Event description

Google Maps:
Generate a directions URL using the venue address.

Map
Embed a responsive Google Maps iframe showing the ceremony location.

⸻

Section 05 — Photo Gallery

Purpose: Add a personal and emotional visual element.

This section is optional.

Layout:

* Editorial photo gallery.
* 3–6 selected images.
* Responsive grid or masonry-inspired layout.
* Use consistent aspect ratios where possible.
* Add a lightbox interaction when clicking an image.

Content:

Section Heading
Momen Kebersamaan

Optional subtitle:

Beberapa momen dan kenangan yang menjadi bagian dari perjalanan kami.

Images:

* Participant portraits.
* Family photographs.
* Traditional Balinese attire.
* Pre-ceremony photography.

Optimize all images for web performance.

⸻

Section 06 — RSVP & Wishes

Purpose: Allow guests to confirm attendance and leave prayers.

Layout:

* Warm background.
* Centered form container.
* Clean input styling.
* Guest wishes displayed below the form.

Content:

Section Heading
Konfirmasi Kehadiran

Subtitle

Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Form Fields

1. Nama Tamu
    * Text input
    * Required
2. Konfirmasi Kehadiran
    * Hadir
    * Tidak Dapat Hadir
    * Required
3. Jumlah Tamu
    * Optional number input
    * Only relevant when attending
4. Ucapan & Doa Restu
    * Textarea
    * Required

Submit Button
Kirim Ucapan

After Submission

* Display a success notification.
* Save the RSVP information to Supabase.
* Refresh the wishes list.
* Prevent duplicate submissions where practical.

Guest Wishes

Display submitted wishes in a vertically stacked list.

Each wish should contain:

* Guest name.
* Attendance status.
* Message.
* Submission date (optional).

Use a clean and readable card design.

Implement loading, empty, success, and error states.

⸻

Section 07 — Closing

Purpose: End the invitation with a respectful and memorable message.

Layout:

* Full-width section.
* Elegant typography.
* Subtle Balinese decorative ornament.
* Family signature.

Content:

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.

Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.

Om Santih, Santih, Santih Om

Kami yang berbahagia,

Keluarga Besar

Bapak [Nama Ayah]
& Ibu [Nama Ibu]

Optional:

* Small family photograph.
* Decorative closing ornament.
* Back-to-top button.

⸻

4. Page Layout & Visual Hierarchy

The page should follow this exact vertical sequence:

1. Opening Cover
2. Greeting & Introduction
3. Participant Profile
4. Event Details
5. Photo Gallery (Optional)
6. RSVP & Wishes
7. Closing

Layout Principles

* Single-page experience.
* Full-width sections with alternating background tones.
* Centered content with a maximum width of approximately 1100px.
* Text-heavy sections should use a narrower content width.
* Consistent vertical spacing between sections.
* Mobile-first responsive implementation.
* Avoid unnecessary UI elements.

Suggested Visual Flow

Section	Layout
Cover	Fullscreen centered hero
Greeting	Centered editorial typography
Participant	Portrait cards
Event Details	Information card + countdown + map
Gallery	Responsive image grid
RSVP	Centered form + wishes list
Closing	Centered family signature

⸻

5. GSAP Animation Guidelines

GSAP should be used to enhance the experience, not distract from the content.

Implement animations using GSAP and ScrollTrigger.

Opening Animation

* Fade out opening cover.
* Reveal main invitation content.
* Animate decorative elements with subtle movement.

Scroll Animations

Greeting:

* Fade in.
* Slight upward movement.

Participant:

* Staggered portrait reveal.
* Name and family information fade in sequentially.

Event Details:

* Countdown card reveals with a subtle upward motion.
* Map and action buttons appear with a slight delay.

Gallery:

* Staggered image reveal.
* Optional subtle image scale effect.

RSVP:

* Form container fades in.
* Guest wishes appear with staggered animation.

Closing:

* Decorative ornaments fade in.
* Family signature reveals last.

Animation Constraints

* Use GSAP context (gsap.context) and clean up animations correctly.
* Use ScrollTrigger for scroll-based animations.
* Avoid excessive parallax.
* Avoid animations that delay access to important event information.
* Respect prefers-reduced-motion.
* Ensure animations do not cause horizontal overflow.
* Keep mobile animations lightweight.

⸻

6. Functional Requirements

Feature	Requirement
Personalized Guest	Support guest name through URL query parameter
Opening Button	Opens the invitation and triggers optional music
Background Music	Play/pause toggle, only after user interaction
Countdown	Real-time countdown to event
Google Calendar	Generate event URL
Google Maps	Embedded map and directions URL
Gallery	Responsive images and lightbox
RSVP	Submit attendance confirmation
Guest Wishes	Display submitted messages
Supabase	Persist RSVP and wishes
Responsive Design	Mobile, tablet, and desktop

Guest Personalization

Support URLs such as:

https://domain.com/?to=I%20Made%20Suardana

Display the decoded guest name dynamically.

Fallback:

Bapak/Ibu/Saudara/i

Never assume the URL query parameter is trusted HTML. Escape user-provided content and render it as plain text.

⸻

7. Suggested Project Structure

src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── components/
│
├── components/
│   ├── invitation/
│   │   ├── OpeningCover.tsx
│   │   ├── GreetingSection.tsx
│   │   ├── ParticipantSection.tsx
│   │   ├── ParticipantCard.tsx
│   │   ├── EventDetailsSection.tsx
│   │   ├── Countdown.tsx
│   │   ├── EventMap.tsx
│   │   ├── PhotoGallery.tsx
│   │   ├── RSVPSection.tsx
│   │   ├── RSVPForm.tsx
│   │   ├── WishesList.tsx
│   │   └── ClosingSection.tsx
│   │
│   ├── ui/
│   │   ├── SectionHeading.tsx
│   │   ├── DecorativeDivider.tsx
│   │   ├── PrimaryButton.tsx
│   │   └── MusicControl.tsx
│   │
│   └── animations/
│       └── ScrollReveal.tsx
│
├── hooks/
│   ├── useCountdown.ts
│   └── useGuestName.ts
│
├── lib/
│   ├── supabase.ts
│   ├── calendar.ts
│   ├── maps.ts
│   └── utils.ts
│
├── data/
│   └── invitation.ts
│
└── types/
    └── invitation.ts
public/
├── images/
├── ornaments/
└── audio/

Adjust the structure when necessary, but maintain separation between UI components, business logic, data, and animation logic.

⸻

8. Data Configuration

Avoid hardcoding invitation information directly inside individual components.

Create a centralized configuration file.

Example:

export const invitationData = {
  event: {
    title: "Upacara Manusa Yadnya Metatah",
    subtitle: "Metatah / Mepandes",
    date: "2027-01-15",
    startTime: "09:00",
    endTime: "13:00",
    timezone: "Asia/Makassar",
  },
  family: {
    father: "Nama Ayah",
    mother: "Nama Ibu",
  },
  participants: [
    {
      name: "Nama Peserta",
      birthOrder: 1,
      photo: "/images/participant-1.jpg",
    },
  ],
  venue: {
    name: "Nama Tempat",
    address: "Alamat Lengkap",
    mapsUrl: "",
    embedUrl: "",
  },
  gallery: [
    "/images/gallery-1.jpg",
    "/images/gallery-2.jpg",
    "/images/gallery-3.jpg",
  ],
  music: {
    enabled: true,
    src: "/audio/balinese-instrumental.mp3",
  },
};

The actual event date, family information, location, and participant data should remain configurable.

⸻

9. Responsive Design Requirements

Mobile

* Primary design target.
* Full-width sections.
* Readable typography.
* Single-column participant cards when necessary.
* Touch-friendly buttons.
* No horizontal scrolling.
* Optimized images and animations.

Tablet

* Balanced section spacing.
* Two-column participant layout where appropriate.
* Responsive gallery.

Desktop

* Maximum content width around 1100px.
* More generous whitespace.
* Larger decorative elements.
* Balanced editorial layouts.

⸻

10. Performance & Accessibility

* Use Next.js Image for optimized photography.
* Lazy-load gallery images.
* Avoid unnecessary client-side components.
* Keep static sections server-rendered where possible.
* Use semantic HTML.
* Provide accessible labels for form controls.
* Maintain sufficient color contrast.
* Add keyboard accessibility for interactive elements.
* Respect reduced-motion preferences.
* Handle invalid or missing URL parameters.
* Ensure countdown handles timezone correctly.

⸻

11. Implementation Phases

Phase 1 — Foundation

* Initialize Next.js project.
* Configure Tailwind CSS.
* Set up typography and design tokens.
* Create the main page structure.
* Create centralized invitation data.

Phase 2 — UI Implementation

* Implement all invitation sections.
* Build reusable components.
* Implement responsive layouts.
* Add decorative Balinese elements.

Phase 3 — Animation

* Integrate GSAP.
* Implement opening animation.
* Implement ScrollTrigger animations.
* Add reduced-motion support.

Phase 4 — Functionality

* Implement guest personalization.
* Implement countdown.
* Implement Google Calendar integration.
* Implement Google Maps integration.
* Implement music controls.
* Implement RSVP and guest wishes using Supabase.

Phase 5 — Polish & Testing

* Test mobile and desktop layouts.
* Verify all event information.
* Test RSVP submission.
* Test countdown timezone.
* Optimize images.
* Check accessibility and performance.
* Verify all animations and interactions.

⸻

12. Final Acceptance Criteria

The project is considered complete when:

* All seven sections are implemented.
* The website is responsive across screen sizes.
* The opening interaction works correctly.
* Guest names can be personalized through URL parameters.
* Countdown displays accurate remaining time.
* Google Calendar integration works.
* Google Maps navigation works.
* RSVP submissions are persisted.
* Guest wishes are displayed correctly.
* GSAP animations work without breaking page layout.
* The website respects reduced-motion preferences.
* All content is configurable from a centralized data source.

Important: Prioritize visual quality, readability, and a smooth user experience. The result should feel like a carefully designed digital family invitation rather than a generic event landing page.

13. Referensi visual layout

Untuk membantu coding agent memahami arah visualnya, berikut gambaran visual yang aku rekomendasikan per bagian.

01. Opening Cover

Fullscreen, ivory background, ornamen Bali sebagai frame dekoratif, judul serif besar dan tombol Buka Undangan.

Mood: Elegant, ceremonial, minimal.

02. Greeting

Teks berada di tengah dengan whitespace luas, ornamen pemisah dan tipografi serif.

Mood: Calm, sacred, editorial.

03. Participant

Portrait peserta menjadi fokus utama dengan frame minimalis dan informasi keluarga di bawahnya.

Mood: Personal, warm, traditional.

04. Event Details

Informasi acara dalam card elegan, countdown, tombol kalender, serta peta.

Mood: Structured, clean, functional.

05. Gallery

Grid foto editorial dengan rasio gambar bervariasi dan lightbox.

Mood: Emotional, visual storytelling.

06–07. RSVP & Closing

Form sederhana dengan background hangat, kemudian penutup dengan ucapan dan tanda tangan keluarga.

Mood: Warm, intimate, respectful.

14. Beberapa keputusan teknis yang menurutku penting

Ada beberapa hal yang sengaja ingin aku tekankan sebelum coding agent mulai bekerja.

* Jangan menjadikan GSAP sebagai dependency untuk semua elemen. Gunakan CSS transition untuk interaksi kecil. GSAP cukup untuk entrance animation, scroll reveal, dan transisi cover. Ini membuat performa mobile lebih baik.
* Jangan membuat seluruh halaman menjadi Client Component. Gunakan Server Component untuk section statis. Client Component cukup untuk countdown, musik, RSVP, personalisasi, dan animasi.
* Perhatikan timezone Bali. Gunakan Asia/Makassar untuk WITA. Jangan sekadar mengandalkan timezone browser karena tamu bisa membuka undangan dari zona waktu berbeda.
* Pisahkan data dari UI. Nantinya kamu bisa membuat undangan untuk keluarga lain hanya dengan mengganti konfigurasi tanpa membongkar komponen.
* RSVP harus memiliki proteksi dasar. Validasi input di server, gunakan Supabase RLS, dan jangan expose service-role key di frontend.

Rekomendasi tambahan dariku

Ada satu fitur yang menurutku cukup menarik untuk undangan seperti ini: personalized invitation URL.

Contohnya:

undangan.com/?to=Keluarga%20Bapak%20Made
undangan.com/?to=I%20Made%20Suardana
undangan.com/?to=Ni%20Putu%20Sari

Ketika tamu membuka undangan, nama mereka otomatis muncul di cover. Ini membuat undangan terasa lebih personal dibandingkan hanya membagikan satu link yang sama kepada semua orang.

Selain itu, aku menyarankan agar coding agent menyelesaikan seluruh UI menggunakan mock data terlebih dahulu sebelum mengintegrasikan Supabase. Dengan begitu, kualitas desain tidak terganggu oleh proses backend.

Urutan pengerjaan terbaik: UI → Animation → Interaction → Backend → Polish.
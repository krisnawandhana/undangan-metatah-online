# Undangan Metatah / Mepandes

Undangan digital Upacara Manusa Yadnya Metatah — Next.js 16 (App Router, Cache Components), Tailwind CSS v4, GSAP, Supabase.

## Menjalankan

```bash
bun install
cp .env.example .env.local   # isi kredensial Supabase, atau pakai RSVP_STORAGE=memory
bun run dev                  # http://localhost:3000/?to=Nama%20Tamu
```

```bash
bun test                     # unit test: timezone, URL Calendar/Maps, validasi RSVP, countdown
```

Saat deploy, set `SITE_URL` ke domain publik — dipakai untuk gambar preview tautan (`app/opengraph-image.tsx`, dirender saat build dari `data/invitation.ts`). Halaman diberi `noindex` karena memuat alamat rumah keluarga; hapus `robots` di `app/layout.tsx` bila ingin muncul di mesin pencari.

Tanpa Supabase, `bun run dev` otomatis memakai penyimpanan memori (data hilang saat restart). Build produksi **wajib** Supabase kecuali `RSVP_STORAGE=memory` diset secara eksplisit.

## Menyiapkan Supabase

1. Buat project di Supabase.
2. Jalankan `supabase/migrations/20261124000000_create_rsvps.sql` lewat SQL Editor (atau `supabase db push`).
3. Isi `.env.local` (dan environment hosting):
   - `SUPABASE_URL` — Project URL
   - `SUPABASE_PUBLISHABLE_KEY` — publishable/anon key. **Jangan** pakai secret/service-role key.

Variabel ini sengaja tanpa prefix `NEXT_PUBLIC_`: browser hanya bicara ke `/api/rsvp`, tidak pernah langsung ke Supabase.

### Lapisan proteksi RSVP

| Lapisan | Di mana |
|---|---|
| Validasi (nama, kehadiran, jumlah tamu, ucapan) | `lib/rsvp.ts` — dijalankan di browser **dan** di server |
| CHECK constraint dengan batas yang sama | migrasi SQL |
| RLS: publik hanya `select` + `insert` kolom tertentu, tanpa update/delete | migrasi SQL |
| Tolak duplikat persis (nama + ucapan) → 409 | unique index |
| Honeypot field `website` | form + route handler |
| Rate limit 5 kiriman / 10 menit / IP (best effort, in-memory) | `lib/server/rate-limit.ts` |
| Same-origin check untuk POST | `app/api/rsvp/route.ts` |

## Mengganti isi undangan

Semua konten ada di `data/invitation.ts` — komponen tidak menyimpan teks/data apa pun.

- **`id`** — kunci RSVP di database. Tetapkan sekali sebelum disebar, jangan diubah.
- **Waktu** — `date`, `startTime`, `endTime` dalam waktu lokal venue; `timezone: "Asia/Makassar"`, `utcOffset: "+08:00"` (WITA). Countdown & Google Calendar memakai instan absolut, jadi benar dari zona mana pun.
- **Peserta** — boleh 1 atau lebih; `parents` per peserta opsional (untuk metatah bersama).
- **Foto** — taruh di `public/images/` lalu isi `photo` / `gallery[].src`. Tanpa `src`, tampil placeholder berornamen. Urutan galeri memengaruhi keseimbangan kolom (pasangkan portrait + landscape).
- **Peta** — `mapsQuery` (alamat atau `"lat,lng"`); opsional `embedUrl` dari Google Maps → Share → Embed.
- **Musik** — taruh file di `public/audio/`, set `music.enabled: true`. Musik hanya mulai setelah tamu menekan "Buka Undangan", berhenti saat tab disembunyikan, dan tombolnya otomatis hilang jika file gagal dimuat.

## Link personal

`https://domain/?to=I%20Made%20Suardana` → nama tampil di cover dan terisi di form RSVP. Nilai dibersihkan (`sanitizeGuestName`) dan selalu dirender sebagai teks.

## Animasi

Section adalah Server Component yang hanya diberi atribut `data-reveal*`; satu hook client (`components/animations/useScrollReveal.ts`) membacanya dengan GSAP + ScrollTrigger. Lihat komentar di file itu untuk daftar atribut. Semua animasi mati otomatis dengan `prefers-reduced-motion`, dan konten tetap terlihat tanpa JavaScript.

GSAP tidak masuk bundle awal: `lib/motion.ts` memuatnya lewat dynamic import saat browser idle (selagi tamu membaca cover). Jangan import `lib/gsap.ts` secara statis dari komponen. Jika chunk GSAP gagal dimuat, undangan tetap terbuka tanpa animasi.

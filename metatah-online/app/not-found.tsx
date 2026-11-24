import Link from "next/link";
import { PatraFlourish } from "@/components/ornaments/Patra";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <PatraFlourish className="h-14 w-28 text-gold" />
      <p className="eyebrow mt-8 text-terracotta-ink">Halaman tidak ditemukan</p>
      <h1 className="mt-4 text-[2.5rem] leading-tight font-medium">Tautan ini tidak tersedia</h1>
      <p className="mt-4 max-w-[26rem] text-brown-soft">
        Mohon periksa kembali tautan undangan yang Anda terima.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 items-center border border-brown/40 px-6 font-bold hover:border-brown"
      >
        Buka undangan
      </Link>
    </main>
  );
}

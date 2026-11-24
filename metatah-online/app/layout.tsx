import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import { invitationData } from "@/data/invitation";
import { formatEventDate } from "@/lib/datetime";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const names = invitationData.participants.map((p) => p.nickname).join(" & ");

const title = `Undangan Metatah · ${names}`;
const description = `${formatEventDate(invitationData.event)} · ${invitationData.venue.name}. ${invitationData.event.description}`;

export const metadata: Metadata = {
  // Absolute URLs for og:image. Set SITE_URL to the public domain in production.
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  openGraph: { title, description, locale: "id_ID", type: "website" },
  twitter: { card: "summary_large_image", title, description },
  // A private family invitation: keep it out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f8f5ef",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${cormorant.variable} ${lato.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}

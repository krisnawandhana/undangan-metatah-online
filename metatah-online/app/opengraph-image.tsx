import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { invitationData } from "@/data/invitation";
import { formatEventDate } from "@/lib/datetime";

/**
 * Link preview for WhatsApp, Instagram, Facebook, X. Rendered once at build
 * time from the same data as the page, so it can never drift out of date.
 */
export const alt = `Undangan ${invitationData.event.ceremony}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const C = {
  ivory: "#F8F5EF",
  cream: "#EEE6D8",
  brown: "#49382E",
  brownSoft: "#6E5D51",
  gold: "#B69A65",
  terracotta: "#8F4F39",
};

// Silhouette of one candi bentar half (same drawing as the cover).
const GATE =
  "M200 640H0v-30h14v-90H4v-20h20v-70H14v-12h26v-62H30v-10h28v-54h-8v-8h26v-46h-6v-7h24v-39h-4v-6h22v-34h-4v-5h20v-27c18-6 30-20 38-36 8-15 20-30 34-44z";

function Gate({ mirror }: { mirror?: boolean }) {
  return (
    <svg
      width="190"
      height="608"
      viewBox="0 0 200 640"
      style={{
        position: "absolute",
        bottom: 0,
        [mirror ? "right" : "left"]: -40,
        transform: mirror ? "scaleX(-1)" : undefined,
      }}
    >
      <path d={GATE} fill={C.cream} stroke={C.gold} strokeWidth="2" />
    </svg>
  );
}

// Fonts are read from disk (uncached I/O under Cache Components). Caching the
// loader lets the image be generated once at build time; base64 strings
// survive the cache's serialisation where raw Buffers do not.
async function loadFonts(): Promise<string[]> {
  "use cache";
  const files = ["CormorantGaramond-Medium.ttf", "CormorantGaramond-Italic.ttf"];
  const data = await Promise.all(files.map((f) => readFile(join(process.cwd(), "assets/fonts", f))));
  return data.map((buf) => buf.toString("base64"));
}

const toArrayBuffer = (b64: string) => {
  const buf = Buffer.from(b64, "base64");
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
};

export default async function Image() {
  const [medium, italic] = (await loadFonts()).map(toArrayBuffer);
  const { event, participants } = invitationData;
  const names = participants.map((p) => p.nickname).join(" & ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: `radial-gradient(ellipse at center, ${C.ivory} 45%, ${C.cream} 100%)`,
          color: C.brown,
          fontFamily: "Cormorant",
          fontWeight: 500, // otherwise the 400 italic face is picked as the closest match
        }}
      >
        <Gate />
        <Gate mirror />
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: `1.5px solid ${C.gold}`,
            opacity: 0.6,
          }}
        />

        <div style={{ fontSize: 26, letterSpacing: 8, color: C.terracotta, textTransform: "uppercase" }}>
          Upacara Manusa Yadnya
        </div>
        <div style={{ fontSize: 150, lineHeight: 1, marginTop: 18 }}>Metatah</div>
        <div style={{ display: "flex", fontSize: 54, fontStyle: "italic", fontWeight: 400, color: C.brownSoft, marginTop: 6 }}>
          <span style={{ color: C.gold, fontStyle: "normal", fontWeight: 500, marginRight: 14 }}>/</span>
          Mepandes
        </div>
        <div style={{ fontSize: 46, fontStyle: "italic", fontWeight: 400, marginTop: 34 }}>{names}</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 22, fontSize: 28, color: C.brownSoft }}>
          <div style={{ width: 56, height: 1.5, background: C.gold, marginRight: 22 }} />
          {formatEventDate(event)}
          <div style={{ width: 56, height: 1.5, background: C.gold, marginLeft: 22 }} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: medium, style: "normal", weight: 500 },
        { name: "Cormorant", data: italic, style: "italic", weight: 400 },
      ],
    },
  );
}

import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ValidRsvp } from "@/lib/rsvp";
import type { Wish } from "@/types/rsvp";

export type CreateResult = { ok: true; wish: Wish } | { ok: false; reason: "duplicate" };

export interface RsvpRepository {
  list(invitationId: string): Promise<Wish[]>;
  create(invitationId: string, data: ValidRsvp): Promise<CreateResult>;
}

export class RsvpConfigError extends Error {}

const LIST_LIMIT = 300;

/* ----------------------------- Supabase ----------------------------- */

type Row = {
  id: string;
  name: string;
  attendance: Wish["attendance"];
  guests: number | null;
  message: string;
  created_at: string;
};

const toWish = (r: Row): Wish => ({
  id: r.id,
  name: r.name,
  attendance: r.attendance,
  guests: r.guests,
  message: r.message,
  createdAt: r.created_at,
});

class SupabaseRsvpRepository implements RsvpRepository {
  constructor(private db: SupabaseClient) {}

  async list(invitationId: string): Promise<Wish[]> {
    const { data, error } = await this.db
      .from("rsvps")
      .select("id, name, attendance, guests, message, created_at")
      .eq("invitation_id", invitationId)
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT);
    if (error) throw new Error(`Supabase list failed: ${error.message}`);
    return (data as Row[]).map(toWish);
  }

  async create(invitationId: string, d: ValidRsvp): Promise<CreateResult> {
    const { data, error } = await this.db
      .from("rsvps")
      .insert({
        invitation_id: invitationId,
        name: d.name,
        attendance: d.attendance,
        guests: d.attendance === "hadir" ? d.guests : null,
        message: d.message,
      })
      .select("id, name, attendance, guests, message, created_at")
      .single();
    // 23505 = unique_violation on rsvps_no_exact_duplicate
    if (error?.code === "23505") return { ok: false, reason: "duplicate" };
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    return { ok: true, wish: toWish(data as Row) };
  }
}

/* ------------------------------ Memory ------------------------------ */
/* For local development and previews only. Data is lost on restart.     */

const seed: Omit<Wish, "id">[] = [
  {
    name: "Keluarga I Nyoman Budiarta",
    attendance: "hadir",
    guests: 4,
    message:
      "Rahajeng! Semoga upacara berjalan lancar dan Putu Agus serta Kadek Ayu senantiasa dalam lindungan Ida Sang Hyang Widhi Wasa.",
    createdAt: "2026-11-20T10:12:00+08:00",
  },
  {
    name: "Ni Luh Putu Sari",
    attendance: "tidak_hadir",
    guests: null,
    message:
      "Mohon maaf belum bisa hadir. Doa terbaik dari jauh, semoga menjadi pribadi yang tenang dan bijaksana.",
    createdAt: "2026-11-18T19:40:00+08:00",
  },
  {
    name: "I Made Suardana",
    attendance: "hadir",
    guests: 2,
    message: "Selamat menempuh tahapan baru. Om Swastyastu, sampai jumpa di hari bahagia.",
    createdAt: "2026-11-15T08:05:00+08:00",
  },
];

const dupKey = (id: string, name: string, message: string) =>
  `${id}\u0000${name.trim().toLowerCase()}\u0000${message.trim()}`;

class MemoryRsvpRepository implements RsvpRepository {
  private rows = new Map<string, Wish[]>();

  private bucket(invitationId: string): Wish[] {
    let rows = this.rows.get(invitationId);
    if (!rows) {
      rows = seed.map((s, i) => ({ ...s, id: `seed-${i}` }));
      this.rows.set(invitationId, rows);
    }
    return rows;
  }

  async list(invitationId: string): Promise<Wish[]> {
    return this.bucket(invitationId).slice(0, LIST_LIMIT);
  }

  async create(invitationId: string, d: ValidRsvp): Promise<CreateResult> {
    const rows = this.bucket(invitationId);
    const key = dupKey(invitationId, d.name, d.message);
    if (rows.some((w) => dupKey(invitationId, w.name, w.message) === key))
      return { ok: false, reason: "duplicate" };
    const wish: Wish = { id: crypto.randomUUID(), ...d, createdAt: new Date().toISOString() };
    rows.unshift(wish);
    return { ok: true, wish };
  }
}

/* ----------------------------- Factory ------------------------------ */

const globalStore = globalThis as unknown as { __rsvpRepo?: RsvpRepository };

export function getRsvpRepository(): RsvpRepository {
  if (globalStore.__rsvpRepo) return globalStore.__rsvpRepo;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  const forceMemory = process.env.RSVP_STORAGE === "memory";

  let repo: RsvpRepository;
  if (!forceMemory && url && key) {
    repo = new SupabaseRsvpRepository(
      createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }),
    );
  } else if (forceMemory || process.env.NODE_ENV !== "production") {
    repo = new MemoryRsvpRepository();
  } else {
    // Fail loudly rather than silently dropping real guests' RSVPs.
    throw new RsvpConfigError("Supabase is not configured (SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY).");
  }

  globalStore.__rsvpRepo = repo;
  return repo;
}

-- RSVP + guest wishes for the digital invitation.
-- One table serves many invitations; rows are scoped by invitation_id.
-- The site never exposes a Supabase key to the browser: every request goes
-- through the Next.js route handler, which uses the publishable (anon) key.
-- RLS below is the second line of defence if that key ever leaks.

create table public.rsvps (
  id            uuid primary key default gen_random_uuid(),
  invitation_id text        not null check (char_length(invitation_id) between 1 and 64),
  name          text        not null check (char_length(btrim(name)) between 1 and 80),
  attendance    text        not null check (attendance in ('hadir', 'tidak_hadir')),
  guests        smallint             check (guests between 1 and 10),
  message       text        not null check (char_length(btrim(message)) between 3 and 500),
  created_at    timestamptz not null default now(),

  constraint rsvps_guests_only_when_attending
    check (attendance = 'hadir' or guests is null)
);

comment on table public.rsvps is 'Guest RSVPs and wishes, publicly readable per invitation.';

-- Listing newest-first for one invitation.
create index rsvps_invitation_created_idx
  on public.rsvps (invitation_id, created_at desc);

-- Blocks the same guest sending the identical message twice
-- (double taps, retries, refresh-and-resubmit).
create unique index rsvps_no_exact_duplicate
  on public.rsvps (invitation_id, lower(btrim(name)), md5(btrim(message)));

-- Row Level Security -------------------------------------------------------

alter table public.rsvps enable row level security;

create policy "Anyone can read wishes"
  on public.rsvps for select
  to anon, authenticated
  using (true);

create policy "Anyone can submit an RSVP"
  on public.rsvps for insert
  to anon, authenticated
  with check (true); -- shape is enforced by the CHECK constraints above

-- No update/delete policies: submitted rows are immutable for the public.

-- Column privileges: clients may only write the user-supplied columns, so
-- id and created_at always come from the database defaults.
revoke all on public.rsvps from anon, authenticated;
grant select on public.rsvps to anon, authenticated;
grant insert (invitation_id, name, attendance, guests, message)
  on public.rsvps to anon, authenticated;

-- Phase 6 (Hardening): Tighten RLS + track match reporter

-- Add reporter_id so we can attribute match submissions.
-- Keep it nullable for existing rows; enforce via RLS for new inserts.
alter table public.matches
  add column if not exists reporter_id uuid;

-- Ensure RLS is enabled (should already be from 001).
alter table public.matches enable row level security;
alter table public.players enable row level security;

-- Tighten players update: only allow a user to update their own player row.
-- Rating updates are performed server-side using the Supabase service role.
drop policy if exists "Allow authenticated update" on public.players;
create policy "Allow authenticated update" on public.players
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Tighten matches insert: require reporter_id to match the authenticated user.
-- Note: server-side service-role inserts bypass RLS; this policy primarily protects client/user inserts.
drop policy if exists "Allow authenticated insert" on public.matches;
create policy "Allow authenticated insert" on public.matches
  for insert
  to authenticated
  with check (reporter_id = auth.uid());

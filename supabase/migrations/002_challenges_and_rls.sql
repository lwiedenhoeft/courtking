-- Phase 6 (Ladder): Add minimal write policies and a challenges table

-- Preconditions: this migration assumes the baseline schema exists.
-- If you're applying via Supabase Dashboard SQL editor on a fresh DB,
-- run 001_initial_schema.sql first.
create extension if not exists "uuid-ossp";

do $$
begin
  if to_regclass('public.players') is null then
    raise exception 'Missing table public.players. Apply 001_initial_schema.sql first.';
  end if;

  if to_regclass('public.matches') is null then
    raise exception 'Missing table public.matches. Apply 001_initial_schema.sql first.';
  end if;
end
$$;

-- Allow authenticated users to create/update their own player row.
-- For MVP we also allow authenticated users to update player ratings.
drop policy if exists "Allow authenticated insert" on public.players;
create policy "Allow authenticated insert" on public.players
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Allow authenticated update" on public.players;
create policy "Allow authenticated update" on public.players
  for update
  to authenticated
  using (true)
  with check (true);

-- Allow authenticated users to insert matches (MVP).
drop policy if exists "Allow authenticated insert" on public.matches;
create policy "Allow authenticated insert" on public.matches
  for insert
  to authenticated
  with check (true);

-- Challenge ladder table
create table if not exists public.challenges (
  id uuid not null default uuid_generate_v4() primary key,
  challenger_id uuid not null references public.players(id) on delete cascade,
  challenged_id uuid not null references public.players(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined','cancelled','completed')),
  resolved_match_id uuid references public.matches(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.challenges enable row level security;

-- Anyone can read challenges for now (simple ladder visibility). If you want private challenges, tighten this.
drop policy if exists "Allow public read access" on public.challenges;
create policy "Allow public read access" on public.challenges
  for select using (true);

-- Only the challenger can create a challenge.
drop policy if exists "Allow challenger insert" on public.challenges;
create policy "Allow challenger insert" on public.challenges
  for insert
  to authenticated
  with check (auth.uid() = challenger_id);

-- Only participants can update (accept/decline/cancel/complete).
drop policy if exists "Allow participants update" on public.challenges;
create policy "Allow participants update" on public.challenges
  for update
  to authenticated
  using (auth.uid() = challenger_id or auth.uid() = challenged_id)
  with check (auth.uid() = challenger_id or auth.uid() = challenged_id);

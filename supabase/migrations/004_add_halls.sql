-- Phase: Add halls table and associate players/matches with halls

-- Create halls table
create table if not exists public.halls (
  id uuid not null default uuid_generate_v4() primary key,
  name text not null unique,
  location text,
  created_at timestamptz not null default now()
);

-- Enable RLS for halls
alter table public.halls enable row level security;

-- Create policy to allow read access to everyone
create policy "Allow public read access" on public.halls
  for select using (true);

-- Add hall_id to players table
alter table public.players
  add column if not exists hall_id uuid references public.halls(id);

-- Add hall_id to matches table
alter table public.matches
  add column if not exists hall_id uuid references public.halls(id);

-- Seed initial halls
insert into public.halls (name, location) values
  ('Großenseebach Hall', 'Großenseebach'),
  ('Weisendorf Hall', 'Weisendorf')
on conflict (name) do nothing;

-- For existing data: assign all players and matches to the first hall (Großenseebach)
-- This ensures no data loss during migration
update public.players
set hall_id = (select id from public.halls where name = 'Großenseebach Hall' limit 1)
where hall_id is null;

update public.matches
set hall_id = (select id from public.halls where name = 'Großenseebach Hall' limit 1)
where hall_id is null;

-- Now make hall_id required (not null)
alter table public.players
  alter column hall_id set not null;

alter table public.matches
  alter column hall_id set not null;

-- Create index for better query performance
create index if not exists idx_players_hall_id on public.players(hall_id);
create index if not exists idx_matches_hall_id on public.matches(hall_id);

-- Add constraint to ensure match participants are in the same hall as the match
-- This is enforced via a check constraint
alter table public.matches
  add constraint matches_players_same_hall check (
    exists (
      select 1 
      from public.players p1, public.players p2
      where p1.id = winner_id 
        and p2.id = loser_id
        and p1.hall_id = hall_id
        and p2.hall_id = hall_id
    )
  );

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Task 2.1: Create players table
create table if not exists public.players (
  id uuid not null default uuid_generate_v4() primary key,
  username text not null unique,
  avatar_url text,
  rating float8 not null default 1500,
  rd float8 not null default 350,
  volatility float8 not null default 0.06,
  created_at timestamptz not null default now()
);

-- Enable RLS for players
alter table public.players enable row level security;

-- Create policy to allow read access to everyone
create policy "Allow public read access" on public.players
  for select using (true);

-- Task 2.2: Create matches table
create table if not exists public.matches (
  id uuid not null default uuid_generate_v4() primary key,
  winner_id uuid not null references public.players(id),
  loser_id uuid not null references public.players(id),
  score text not null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable RLS for matches
alter table public.matches enable row level security;

-- Create policy to allow read access to everyone
create policy "Allow public read access" on public.matches
  for select using (true);

-- Task 2.3: Seed Data
insert into public.players (username, rating, rd, volatility) values
  ('Stefan (ASV)', 1500, 350, 0.06),
  ('Lars (Weisendorf)', 1500, 350, 0.06),
  ('Anna (Pro)', 1600, 300, 0.06),
  ('Markus (Rookie)', 1400, 350, 0.06),
  ('Julia (Allrounder)', 1500, 350, 0.06)
on conflict (username) do nothing;

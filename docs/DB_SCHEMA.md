# Database Schema (Supabase / PostgreSQL)

## Table: `players`
- `id` (uuid, PK): Unique Player ID.
- `username` (text, unique): Display name (e.g., "Stefan (ASV)").
- `rating` (float8): Glicko-2 rating (Default: 1500).
- `rd` (float8): Rating Deviation (Default: 350).
- `volatility` (float8): Rating Volatility (Default: 0.06).
- `avatar_url` (text): Path to storage.
- `created_at` (timestamptz).

## Table: `matches`
- `id` (uuid, PK).
- `player_a_id` (uuid, FK -> players.id).
- `player_b_id` (uuid, FK -> players.id).
- `winner_id` (uuid, FK -> players.id).
- `score` (text): String representation (e.g., "21-19, 18-21, 21-15").
- `verified` (boolean): If match is confirmed.
- `created_at` (timestamptz).

## Important Notes
- RLS (Row Level Security) is enabled.
- All fetches should select specific columns, not `select('*')` in production, but `*` is okay for MVP.
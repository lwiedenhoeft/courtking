# GitHub Copilot Instructions

## Project Context
- **Name**: CourtKing (formerly Sebach Smash League)
- **Description**: A hyper-local, mobile-first SaaS for badminton players in Großenseebach/Weisendorf to track matches and rankings.
- **Domain Logic**: 
  - Uses **Glicko-2** (not standard Elo) for rating.
  - Accounts for Rating Deviation (RD) and Volatility.
  - "Offline-first" approach for bad gym connectivity.
- **Target Device**: Mobile Smartphones (PWA).

## Tech Stack
- **Framework**: Next.js 14+ (App Router, Server Components).
- **Language**: TypeScript (Strict mode).
- **Styling**: Tailwind CSS (Mobile-first).
- **Backend/DB**: Supabase (PostgreSQL, Auth, Realtime).
- **Deployment**: Vercel.

## Architecture & Patterns
- **Server Components (RSC)**: Fetch data directly in `page.tsx` or `layout.tsx` using Supabase Server Client. Do not use `useEffect` for initial data fetching.
- **Server Actions**: Use Server Actions (`'use server'`) for all mutations (creating matches, updating profiles). Do not use API routes unless necessary for webhooks.
- **Client Components**: Only use `'use client'` for interactive elements (Buttons, Forms, Realtime subscriptions).
- **Supabase**: 
  - Use `createClient` from `@supabase/ssr`.
  - Always use generated Database Types.
  - **RLS**: Row Level Security is enabled.

## Code Style & Conventions
- **Formatting**: Prettier default.
- **Naming**: 
  - Components: PascalCase (e.g., `MatchCard.tsx`).
  - Functions: camelCase (e.g., `calculateGlicko`).
  - Database: snake_case (e.g., `elo_rating`, `player_id`).
- **Typing**: No `any`. Define interfaces for all props and data returns.
- **Tailwind**: Use utility classes. Avoid `@apply` in CSS files. Use `clsx` or `tailwind-merge` for dynamic classes.

## Specific "Gotchas" (Do Not Hallucinate)
1. **Glicko-2 Math**: When calculating ratings, remember we track `rating` (mu), `rd` (phi), and `volatility` (sigma). Do not use the simple Elo formula ($R_a + K(S - E)$).
2. **Next.js Caching**: When fetching data in RSC, verify if we need `revalidatePath` after mutations.
3. **PWA**: Keep UI simple. No heavy animations. Touch targets must be at least 44px. Ensure `user-scalable=no` behavior for app-like feel.

## Roadmap & Phases (See TASKS.md)
1. **Fundament**: Next.js setup, Supabase connection, Types.
2. **Database**: `players` and `matches` tables, Seed data.
3. **Frontend Core**: Leaderboard UI, Player Detail Page (Read-Only).
4. **Interaktion**: Auth (Magic Link), Match Reporting, Glicko-2 Engine.
5. **PWA**: Manifest, Icons, Viewport polish.

## Database Schema
Refer to `docs/DB_SCHEMA.md` for detailed schema.
- **players**: `id`, `username`, `rating`, `rd`, `volatility`, `avatar_url`.
- **matches**: `id`, `winner_id`, `loser_id`, `score`, `verified`.

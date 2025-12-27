
# 🏸 CourtKing: Local Badminton Flex League

**A hyper-local, data-driven matchmaking platform for ambitious recreational players.**

## 1. Executive Summary

**CourtKing** (working title) is a Progressive Web App (PWA) that digitizes and makes badminton more flexible in the Großenseebach/Weisendorf region. It solves the problem of rigid league structures with an asynchronous challenge system. Based on the **Glicko-2 algorithm**, the platform enables fair, exciting matches between players of similar level — independent of fixed schedules and without the need for teams.

---

## 2. The Problem (Status Quo)

Ambitious recreational players often face a dilemma:

* **Rigid structures:** Official league play (BBV) requires fixed teams, weekend appointments, and long travel.
* **Lack of flexibility:** Work and family often don’t allow fixed training times.
* **Skill mismatch:** In casual club play you frequently end up with opponents who are either far too strong or too weak. That slows learning and reduces fun.
* **Organizational overhead:** Scheduling happens chaotically via WhatsApp groups ("Who has time today?").

---

## 3. The Solution

An **“offline-first” web app** that acts as a digital layer on top of local sports halls.

* **Flex ranking:** A live leaderboard that updates after every match.
* **On-demand matchmaking:** Players challenge each other whenever they have time (e.g., Tuesday 8pm).
* **Smart scoring:** Glicko-2 integration to compute skill more precisely, taking inactivity and result confidence into account.

---

## 4. Value Proposition

### For Players (The User)

> *“Play when you want, against who you want — and always know exactly where you stand.”*

* **Autonomy & flexibility:** No season lock-in. Matches happen when both players have time.
* **Fair competition:** The algorithm helps players find opponents at the right level (flow channel: 40–60% win probability).
* **Gamification & progress:** Visible improvement via rating curves and “reliability scores.” Training gains a measurable goal.
* **Simplicity:** No app download required. Works instantly in the browser, even with poor reception in the hall.

### For Clubs & Community (The Partner)

> *“Bring life to the hall and retain members through digital innovation.”*

* **Member retention:** A modern offering keeps younger, digitally-minded players engaged.
* **Better court utilization:** “Dead times” in the hall get filled with ad-hoc challenge matches.
* **Cross-club connection:** The “wall” between Großenseebach and Weisendorf becomes more permeable — people play together instead of side-by-side.

---

## 5. Technical Highlights (Tech Stack)

This project serves as a proof of concept for modern web development in a rural context.

| Component | Technology | Rationale |
| --- | --- | --- |
| **Frontend** | **Next.js (React)** | Performance, SEO, and PWA capabilities. |
| **Styling** | **Tailwind CSS** | Mobile-first design system. |
| **Backend** | **Supabase** | PostgreSQL database & realtime subscriptions. |
| **Logic** | **Glicko-2** | Research-backed rating system (more robust than Elo). |
| **Hosting** | **Vercel** | Edge network for minimal latency. |

---

## 6. Roadmap (MVP)

* **Phase 1 (Alpha):** Release a “read-only” leaderboard with dummy data.
* **Phase 2 (Beta):** Match reporting + auth (magic link login). Pilot with 10 players (“Sebach Squad”).
* **Phase 3 (Live):** Integrate Glicko-2 updates and activity badges. Rollout to all club members.

---

## 7. Contact & Contributing

**Project lead:** [Your Name]
**Status:** Actively developed
**Repository:** github.com/[user]/badminton-league

> *Digitizing local sports — one match at a time.*
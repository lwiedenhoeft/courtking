
# 🏸 CourtKing: Local Badminton Flex-League

**Hyper-lokale, datengetriebene Matchmaking-Plattform für den ambitionierten Breitensport.**

## 1. Executive Summary

**CourtKing** (Arbeitstitel) ist eine Progressive Web App (PWA), die den Badmintonsport in der Region Großenseebach/Weisendorf digitalisiert und flexibilisiert. Sie löst das Problem starrer Liga-Strukturen durch ein asynchrones Forderungssystem. Basierend auf dem **Glicko-2 Algorithmus**, ermöglicht die Plattform faire, spannende Matches auf Augenhöhe – zeitunabhängig und ohne Mannschaftszwang.

---

## 2. Das Problem (Status Quo)

Ambitionierte Hobbyspieler stehen oft vor einem Dilemma:

* **Starre Strukturen:** Der offizielle Ligabetrieb (BBV) erfordert feste Mannschaften, Wochenend-Termine und lange Fahrten.
* **Mangelnde Flexibilität:** Beruf und Familie lassen oft keine festen Trainingszeiten zu.
* **Skill-Mismatch:** Beim freien Spiel im Verein trifft man oft auf Gegner, die entweder viel zu stark oder zu schwach sind. Das hemmt den Lernfortschritt und den Spaß.
* **Organisatorischer Aufwand:** Verabredungen laufen chaotisch über WhatsApp-Gruppen ("Wer hat heute Zeit?").

---

## 3. Die Lösung

Eine **"Offline-First" Web-App**, die als digitale Schicht über den lokalen Sporthallen liegt.

* **Flex-Ranking:** Eine lebende Rangliste, die sich nach jedem Spiel aktualisiert.
* **On-Demand Matchmaking:** Spieler fordern sich gegenseitig heraus, wann immer sie Zeit haben (z.B. Dienstagabend 20 Uhr).
* **Smart Scoring:** Integration von Glicko-2 zur präzisen Berechnung der Spielstärke unter Berücksichtigung von Inaktivität und Ergebnis-Klarheit.

---

## 4. Value Proposition (Das Nutzenversprechen)

### Für den Spieler (The User)

> *"Spiele wann du willst, gegen wen du willst – und wisse immer genau, wo du stehst."*

* **Autonomie & Flexibilität:** Kein Saison-Zwang. Matches finden statt, wenn beide Spieler Zeit haben.
* **Fairer Wettbewerb:** Dank des Algorithmus finden Spieler Gegner auf ihrem exakten Niveau (Flow-Channel: 40-60% Gewinnwahrscheinlichkeit).
* **Gamification & Fortschritt:** Sichtbare Entwicklung durch Rating-Kurven und "Reliability-Scores". Das Training bekommt ein messbares Ziel.
* **Einfachheit:** Kein App-Download nötig. Funktioniert sofort im Browser, auch bei schlechtem Netz in der Halle.

### Für die Vereine & Community (The Partner)

> *"Belebe die Halle und binde Mitglieder durch digitale Innovation."*

* **Mitgliederbindung:** Ein modernes Angebot hält junge, digital-affine Spieler im Verein.
* **Hallen-Auslastung:** "Tote Zeiten" in der Halle werden durch individuelle Forderungsspiele gefüllt.
* **Vereinsübergreifende Vernetzung:** Die "Mauer" zwischen Großenseebach und Weisendorf wird durchlässig – man spielt miteinander statt nebeneinander her.

---

## 5. Technische Highlights (Tech Stack)

Das Projekt dient als Proof-of-Concept für moderne Web-Entwicklung im ländlichen Raum.

| Komponente | Technologie | Begründung |
| --- | --- | --- |
| **Frontend** | **Next.js (React)** | Performance, SEO und PWA-Fähigkeit. |
| **Styling** | **Tailwind CSS** | Mobile-First Design System. |
| **Backend** | **Supabase** | PostgreSQL Datenbank & Realtime Subscriptions. |
| **Logic** | **Glicko-2** | Wissenschaftlich fundiertes Rating-System (überlegen gegenüber ELO). |
| **Hosting** | **Vercel** | Edge Network für minimale Latenz. |

---

## 6. Roadmap (MVP)

* **Phase 1 (Alpha):** Release der "Read-Only" Rangliste mit Dummy-Daten.
* **Phase 2 (Beta):** Match-Reporting Funktion & Auth (Login via Magic Link). Testlauf mit 10 Spielern ("Sebach Squad").
* **Phase 3 (Live):** Integration der Glicko-2 Berechnung und "Badges" für Aktivität. Rollout für alle Vereinsmitglieder.

---

## 7. Kontakt & Mitmachen

**Projektleitung:** [Ihr Name]
**Status:** In aktiver Entwicklung
**Repository:** `github.com/[user]/badminton-league`

> *Digitalisiert den Dorf-Sport – ein Match nach dem anderen.*
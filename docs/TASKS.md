Hier ist der konkrete **Implementierungsplan (Backlog)**, aufgeteilt in logische Phasen. Da noch keine Zeile Code geschrieben wurde, fangen wir bei Null an, nutzen aber Ihre bestehende Infrastruktur (Vercel/Supabase).

Sie können diese Liste direkt in ein Projektmanagement-Tool (Notion, Trello, GitHub Projects) kopieren.

---

### Phase 1: Fundament & Infrastruktur

*Ziel: Eine leere, aber konfigurierte Next.js App, die lokal läuft und mit der Cloud-Datenbank verbunden ist.*

* [x] **Task 1.1: Next.js Projekt initialisieren**
* [x] Befehl ausführen: `npx create-next-app@latest court-king --typescript --tailwind --eslint`
* [x] Clean-up: Löschen der Standard-Inhalte in `src/app/page.tsx` und `globals.css`.
* [x] **DoD (Definition of Done):** Die App zeigt eine weiße Seite mit "Hello CourtKing" und läuft auf `localhost:3000`.


* [x] **Task 1.2: Environment Variablen setzen**
* [x] `.env.local` Datei anlegen.
* [ ] `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY` aus dem Supabase Dashboard einfügen.
* [x] **DoD:** `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)` gibt lokal die korrekte URL aus.


* [x] **Task 1.3: Supabase Type Generation einrichten**
* [ ] Supabase CLI login (optional, oder manuell Typen anlegen).
* [x] Alternativ: Eine `src/types/database.ts` anlegen für manuelle Typisierung.
* [x] **DoD:** TypeScript beschwert sich nicht, wenn wir später Datenbank-Abfragen schreiben.


* [ ] **Task 1.4: Erstes Deployment auf Vercel**
* [ ] Code auf GitHub pushen.
* [ ] Repository in Vercel importieren.
* [ ] Environment Variables (aus 1.2) in Vercel Settings eintragen.
* [ ] **DoD:** Die "Hello CourtKing" Seite ist unter `https://court-king.vercel.app` öffentlich erreichbar.



---

### Phase 2: Datenbank & Glicko-Datenmodell

*Ziel: Die Datenbankstruktur in Supabase steht bereit für den Glicko-2 Algorithmus.*

* [x] **Task 2.1: Tabelle `players` erstellen (SQL)**
* [x] Spalten: `id` (UUID), `username` (Text), `avatar_url` (Text).
* [x] Glicko-Spalten: `rating` (Float, Default 1500), `rd` (Float, Default 350), `volatility` (Float, Default 0.06).
* [x] **DoD:** Tabelle existiert und man kann manuell einen Test-User im Dashboard anlegen.


* [x] **Task 2.2: Tabelle `matches` erstellen (SQL)**
* [x] Spalten: `id`, `created_at`, `winner_id`, `loser_id`.
* [x] Spalte `score_text` (z.B. "21-19, 21-18").
* [x] Foreign Keys setzen (Referenzen zu `players`).
* [x] **DoD:** Tabelle existiert und verknüpft die Player-IDs korrekt.


* [x] **Task 2.3: Seed Data (Testdaten) einfügen**
* [x] SQL-Skript schreiben, das 5 fiktive Spieler aus Großenseebach/Weisendorf einfügt.
* [x] **DoD:** Ein `SELECT * FROM players` liefert Ergebnisse.



---

### Phase 3: Frontend Core (Read-Only)

*Ziel: Die Rangliste ist sichtbar und zieht Daten aus der DB.*

* [x] **Task 3.1: Supabase Client Utility erstellen**
* [x] `src/utils/supabase/server.ts` (für Server Components) erstellen.
* [x] `src/utils/supabase/client.ts` (für Client Components) erstellen.
* [x] **DoD:** Wir können `createClient()` importieren.


* [x] **Task 3.2: Leaderboard UI (Server Component)**
* [x] `src/app/page.tsx` so umbauen, dass es Daten fetcht.
* [x] Sortierung: `ORDER BY rating DESC`.
* [x] Design: Eine Liste (Cards) mit Rang, Name, Rating und RD (Unsicherheit).
* [x] **DoD:** Die 5 Test-Spieler aus Task 2.3 werden auf der Homepage korrekt angezeigt.


* [x] **Task 3.3: Player Detail Page (Dynamic Route)**
* [x] Route `src/app/player/[id]/page.tsx` anlegen.
* [x] Anzeigen der Match-Historie dieses Spielers.
* [x] **DoD:** Klick auf einen Namen in der Rangliste öffnet das Profil.



---

### Phase 4: Interaktion & Logik (The "Flex" Part)

*Ziel: Man kann Ergebnisse eintragen und das Ranking verändert sich.*

* [x] **Task 4.1: Authentication (Magic Link)**
* [x] Login-Seite bauen (`/login`).
* [x] Supabase Auth konfigurieren (E-Mail Provider aktivieren).
* [x] **DoD:** Ich kann mich mit meiner E-Mail einloggen und sehe danach einen "Logout"-Button.


* [x] **Task 4.2: Match-Eingabe Formular**
* [x] Seite `/match/new` erstellen (nur für eingeloggte User).
* [x] Dropdown für "Gegner wählen".
* [x] Eingabefelder für den Score.
* [x] **DoD:** Formular sendet Daten an eine Server Action.


* [x] **Task 4.3: Glicko-2 Engine Integration**
* [x] Library installieren: `npm install glicko2`.
* [x] Server Action schreiben (`submitMatch`):
1. Lädt aktuelle Ratings beider Spieler.
2. Berechnet neue Ratings via `glicko2`.
3. Updated die `players` Tabelle mit neuen Werten.
4. Speichert das Match in `matches`.


* [x] **DoD:** Nach Eintragen eines Sieges ändern sich die Punkte auf dem Leaderboard sofort.



---

### Phase 5: PWA & Polish

*Ziel: Die App fühlt sich auf dem Handy in der Halle gut an.*

* [x] **Task 5.1: Manifest & Icons**
* [x] `manifest.json` erstellen (Name: "CourtKing", Display: "standalone").
* [x] App-Icon (192x192, 512x512) generieren und ablegen.
* [x] **DoD:** In Chrome DevTools (Application Tab) werden keine Fehler beim Manifest angezeigt.


* [x] **Task 5.2: Meta Tags & Viewport**
* [x] Sicherstellen, dass `user-scalable=no` (oder entsprechendes Zoom-Handling) gesetzt ist, damit es sich wie eine App anfühlt.
* [x] **DoD:** Die App sieht auf dem Handy-Screen "native" aus (keine Browser-Leiste im Fullscreen-Modus).

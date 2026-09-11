# Botirjon & Durdonaxon Final Invitation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first Vite/React wedding invitation matching the approved light lavender floral design, with seven scroll sections, real-time countdown, global music, map CTA, and guest wishes.

**Architecture:** A dependency-free static app renders seven full-height sections from a single semantic HTML page, with CSS motion and small JavaScript modules for countdown and guest wishes. Guest wishes work immediately with browser persistence and can transparently use a Vercel `/api/wishes` endpoint backed by Supabase environment variables when configured.

**Tech Stack:** HTML5, CSS3, modern ES modules, Node built-in tests, Vercel Functions.

**Spec:** `docs/superpowers/specs/2026-09-11-invitation-design.md`

## Global Constraints
- Couple: Botirjon & Durdonaxon.
- Date/time: 26.09.2026 15:00 Asia/Tashkent.
- Venue: Oqsaroy to'yxona.
- Section order: Intro, Tabrik, Ar-Rum 21, To'y ma'lumotlari, Countdown, Lokatsiya, Mehmonlar tilaklari.
- No program page and no RSVP page.
- Use the uploaded MP3 as one global audio source; section changes must not restart it.
- Light ivory watercolor background, purple floral corners, muted gold line art, drifting petals.
- Respect `prefers-reduced-motion`.

---

### Task 1: Project scaffold and deterministic core logic

**Files:**
- Create: `package.json`, `index.html`
- Create: `lib/countdown.mjs`, `test/countdown.test.mjs`
- Create: `lib/wishes.mjs`, `test/wishes.test.mjs`

**Interfaces:**
- Produces: `getCountdown(target, now)` and guest-wish parsing/storage helpers used by UI.

- [ ] Write failing countdown tests for a future target, exact target, and post-event zero state.
- [ ] Run the focused tests and verify RED.
- [ ] Implement countdown helper and verify GREEN.
- [ ] Write failing wish normalization/storage tests.
- [ ] Run and verify RED.
- [ ] Implement helpers and verify GREEN.
- [ ] Commit task.

### Task 2: Invitation shell, seven sections, and visual system

**Files:**
- Create: `index.html`, `styles.css`, `app.js`
- Create: `assets/floral-corner.svg`, `assets/floral-wreath.svg`

**Interfaces:**
- Consumes: countdown and wish helpers from Task 1.
- Produces: complete seven-section page structure and responsive styling.

- [ ] Add a failing render test asserting all seven section headings/order and absence of Program/RSVP copy.
- [ ] Run and verify RED.
- [ ] Implement the sections and floral/watercolor styling.
- [ ] Run the render test and verify GREEN.
- [ ] Commit task.

### Task 3: Motion, countdown updates, and global audio

**Files:**
- Modify: `app.js`, `styles.css`
- Copy: uploaded MP3 to `public/audio/botirjon-durdonaxon.mp3`

**Interfaces:**
- Produces: one persistent `<audio>` element with play/pause control; calm reveal/petal/scroll animations.

- [ ] Add tests for countdown label formatting and music-control accessible state.
- [ ] Verify RED.
- [ ] Implement live one-second countdown and global audio behavior.
- [ ] Add IntersectionObserver-based reveal and reduced-motion fallbacks.
- [ ] Verify tests GREEN.
- [ ] Commit task.

### Task 4: Location and guest wishes

**Files:**
- Create: `api/wishes.js`
- Modify: `index.html`, `app.js`, `lib/wishes.mjs`
- Create: `vercel.json`

**Interfaces:**
- `/api/wishes` GET returns `{ wishes: Wish[] }`; POST accepts `{ name, message }`.
- Frontend falls back to local persistence if the API/database is unavailable.

- [ ] Add failing tests for form validation and optimistic/local fallback.
- [ ] Verify RED.
- [ ] Implement Google Maps venue search/embed and CTA.
- [ ] Implement wishes API using `DATABASE_URL` when present plus local fallback in UI.
- [ ] Verify tests GREEN.
- [ ] Commit task.

### Task 5: Final polish, documentation, and deployment package

**Files:**
- Create: `README.md`, `.gitignore`, `.env.example`
- Modify: any files required by verification findings.

**Interfaces:**
- Produces: GitHub/Vercel-ready repository and ZIP artifact.

- [ ] Run `npm test` and ensure zero failures.
- [ ] Run `npm run check` and ensure exit 0.
- [ ] Run a local HTTP smoke check for HTML/CSS/JS/audio assets.
- [ ] Run `git diff --check`.
- [ ] Document deploy steps and guestbook persistence behavior.
- [ ] Commit final task.

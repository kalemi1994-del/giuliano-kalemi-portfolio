# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The personal portfolio site for Giuliano Kalemi (AI & Marketing Strategist, Bologna). A single-page React app with a full-screen interactive 3D particle background (react-three-fiber) that is synced in real time across visitors via WebSockets, plus two Gemini-backed AI features: a free "marketing audit" report generator and a voice-enabled robot chat assistant. Originally scaffolded in Google AI Studio (see `metadata.json`, `.env.example` comments about AI Studio secrets injection) and deployed to Render (`render.yaml`).

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server (tsx server.ts) — Express + Vite middleware, with HMR
npm run build     # vite build (client) + esbuild bundle of server.ts -> dist/server.cjs
npm start         # run the production build (node dist/server.cjs); requires `npm run build` first
npm run clean     # rm -rf dist
npm run lint      # tsc --noEmit (there is no separate typecheck script — this IS the typecheck)
```

There is no test suite/framework configured in this repo.

Local env: copy `.env.example` guidance and set `GEMINI_API_KEY` in `.env.local` (or `.env`, loaded via `dotenv/config` in `server.ts`). Without it, `/api/audit` and `/api/chat` return HTTP 500.

## Architecture

### One process, one server, dual role

`server.ts` is the single entry point for both dev and prod — there is no separate API server. It:
- Creates an Express app + `http.createServer` + a `WebSocketServer` attached to the same HTTP server (same port).
- In dev (`NODE_ENV !== 'production'`), mounts Vite in middleware mode (`appType: 'spa'`) to serve/transform the React app.
- In prod, serves the static `dist/` build instead.
- Exposes REST endpoints `/api/health`, `/api/audit`, `/api/chat`, and handles all WebSocket traffic on the same upgrade path (no separate `/ws` route — client connects to `ws(s)://<host>`).

When editing server behavior, `server.ts` is the whole backend — routes, WebSocket handling, and Gemini calls all live in this one file.

### Real-time multiplayer particle background

Every visitor is a "player" with a live cursor tracked over WebSockets and rendered as a 3D presence in everyone else's browser — this is the site's signature interactive background, not a side feature.

- **Server side (`server.ts`)**: in-memory `Map`s for `players`, `forceFields`, `clients` (no persistence/DB). On connect, assigns a random color + uuid, sends an `init` message with full current state, and broadcasts `player_joined`. A 20 Hz (`setInterval(50ms)`) loop broadcasts a `sync` message with all player positions, and expires force fields after ~10.5s. Client messages are `cursor` (position update) and `add_force` (spawn an attractor/repulsor).
- **Client side (`src/store/useGameStore.ts`)**: single Zustand store owning the WebSocket connection and mirroring server state (`players`, `forceFields`). Auto-reconnects on unexpected close. `App.tsx` calls `connect()`/`disconnect()` in a top-level `useEffect`.
- **Rendering (`src/components/CosmicCanvas.tsx`)**: the `@react-three/fiber` `<Canvas>` root. Composes `Particles` (simplex-noise-driven flow field, see `src/utils/curlNoise.ts`), `ForceFields`, `OtherPlayers`/`LocalCursor`, and a `SceneInteraction` component that raycasts pointer position onto a z=0 plane and calls `sendCursor`/`addForce` from the store. Left-click/tap spawns an attractor; Space spawns a repulsor at the last known cursor position. Pointer/keyboard handlers explicitly ignore clicks landing on interactive UI (`button`, `input`, `textarea`, `a`, `form`, `.interactive-portfolio`) so the 3D layer doesn't steal input from the page content.
- `CanvasControls.tsx` lets the user toggle the whole canvas off (perf/accessibility escape hatch); `App.tsx` swaps in a flat background div when disabled.

### Page structure

`src/App.tsx` is a single scrolling page assembling section components in order: `Header` → hero → `AboutSection` → `ServicesSection` → `MethodSection` → `AuditSection` → `ContactSection` → footer, plus the floating `RobotAssistant`. Active-section highlighting in the header is driven by a manual scroll-position listener (no router — this is intentionally a one-page site, not a multi-route app). Section anchors are plain `id` attributes (`hero`, `about`, `services`, `method`, `audit`, `contact`) scrolled to via `scrollIntoView`.

### Gemini-backed features (both server-side only — no API key on the client)

Both features call `GoogleGenAI` (`@google/genai`) from `server.ts` only; the client never sees `GEMINI_API_KEY`. Both use `generateWithRetry` (retries once/twice on transient 503 "high demand" errors) and model `gemini-3.5-flash`. System prompts are written in Italian and encode Giuliano's brand voice/methodology directly in `server.ts` — when adjusting tone, positioning, or the audit report structure, edit the `systemInstruction` strings there, not the React components.

- **`AuditSection.tsx` → `POST /api/audit`**: multipart form (company, sector, website, challenges, email + optional PDF/DOCX upload). Server extracts document text via `pdf-parse` or `mammoth` (`extractDocumentText`, 8MB limit via `multer`), truncates to 6000 chars, and asks Gemini to produce a structured Markdown "Audit Marketing & AI" report following Giuliano's fixed methodology (Audit → Strategia → Produzione → Trasferimento).
- **`RobotAssistant.tsx` → `POST /api/chat`**: a floating voice-enabled chatbot. Uses the browser's `window.speechSynthesis` for TTS (voices loaded async via `onvoiceschanged`) and (per component) the Web Speech `SpeechRecognition` API for voice input. Sends the last 6 turns of `history` plus the new `message`; server replies are short (2-3 sentence) spoken-style Italian, no markdown.

### Styling / stack conventions

- Tailwind CSS v4 via the `@tailwindcss/vite` plugin (no separate `tailwind.config.js` — v4 is CSS-first; check `src/index.css` for `@theme`/config if adding design tokens).
- Path alias `@/*` → repo root, configured in both `tsconfig.json` and `vite.config.ts`.
- Animations use `motion` (Framer Motion's successor package, imported as `motion/react`).
- Icons from `lucide-react`.
- All source files carry an Apache-2.0 SPDX header comment (`@license` block) — keep this on new files for consistency with the AI-Studio-scaffolded origin.
- UI copy (audit form, chat, section content) is in Italian; keep new user-facing strings consistent with that.

## Deployment

`render.yaml` defines a single Render web service: `npm install && npm run build` then `npm start`, with `GEMINI_API_KEY` injected as a secret (`sync: false`) and `NODE_ENV=production`. There's no separate static hosting — the same Express server serves the built client and handles API/WebSocket traffic in production too.

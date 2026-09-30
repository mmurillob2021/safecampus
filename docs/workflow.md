# SafeCampus — Architecture & Workflow

## Design source
Figma Make project "SafeCampus App Design"
(`figma.com/make/UqeFKtWomCAgJ6tz2Rns2W`). Figma MCP was not connected in
this session and the Make canvas requires an authenticated render, so the
only visual reference available was the file's public cover thumbnail
(the Login screen). Visual tokens in `frontend/src/theme` are inferred
from that screenshot: dark navy background, gold/amber accent, white
card surfaces, rounded corners. Re-run with Figma MCP connected to pull
exact tokens/screens and reconcile `theme/colors.ts` + spacing.

## Repositories
- `frontend/` — React Native (Expo) + TypeScript client app.
- `backend/` — Node.js + Express + TypeScript + Prisma (PostgreSQL) API,
  with a Socket.IO channel for real-time alerts/notifications.

Both are independent projects (separate `package.json`), talking over a
REST API + WebSocket, so either can be deployed/scaled on its own.

## Backend module layout
Each domain lives under `src/modules/<name>` with 3-4 files, none over
100 lines: `*.routes.ts` (wiring), `*.controller.ts` (HTTP I/O),
`*.service.ts` (business logic + Prisma), `*.schema.ts` (zod validation,
where input shape warrants it). Cross-cutting concerns live in
`src/middleware`, `src/utils`, `src/config`.

## Frontend layout
`screens/<domain>` hold one screen each; `components/` holds shared,
presentation-only building blocks; `services/api/<domain>.api.ts` wraps
each backend module's endpoints; `store/` holds small Zustand stores;
`theme/` centralizes color/typography/spacing so no screen hardcodes a
value (DRY, single source of pixel truth once real tokens land).

## End-to-end flow example (SOS)
1. `SosButton` (component) → `sosStore.trigger()` captures location via
   `useLocation` → `alerts.api.ts` POSTs `/alerts`.
2. Backend `alert.service.ts` persists the alert, then emits
   `sos:new` over Socket.IO to all connected `SECURITY`/`ADMIN` clients.
3. Security-side client (same app, `Security` role) listens on
   `sos:new` and lists it in the alerts feed; resolving it PATCHes
   `/alerts/:id/resolve`, which emits `sos:resolved` back to the
   original student's socket room.

## Running locally
See `backend/README` env vars (`.env.example`) and
`frontend/package.json` scripts. Backend needs a PostgreSQL instance and
`npx prisma migrate dev`. Frontend needs `EXPO_PUBLIC_API_URL` pointing
at the backend.

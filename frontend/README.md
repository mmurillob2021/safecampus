# SafeCampus Frontend

React Native (Expo) + TypeScript client for the SafeCampus campus-safety
app. Visual identity (colors in `src/theme/colors.ts`) is inferred from
the Figma Make project's public cover thumbnail (login screen) — the
only screen reachable without an authenticated Figma session or a
connected Figma MCP server. Re-sync `src/theme` and screen layouts once
real design tokens/screens are available.

## Setup

```bash
npm install
npm start
```

Set `expo.extra.apiUrl` / `expo.extra.socketUrl` in `app.json` to point
at your running backend (defaults to `http://localhost:4000`).

## Structure
- `src/screens/<domain>` — one screen per file, grouped by use case.
- `src/components` — shared, presentation-only building blocks.
- `src/services/api` — one thin wrapper per backend module.
- `src/store` — Zustand stores (`authStore`, `sosStore`).
- `src/navigation` — auth stack, tab navigator, incidents sub-stack.
- `src/theme` — single source of truth for color/spacing/typography.

See `../docs/use-cases.md` and `../docs/workflow.md` for the product
and architecture rationale.

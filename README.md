# SafeCampus

A campus-safety app: one-tap SOS alerts, incident reporting, a campus
safety map, emergency contacts, and campus-wide notifications.

## Layout
- `frontend/` — React Native (Expo) + TypeScript client. See its README.
- `backend/` — Node.js + Express + TypeScript + Prisma API with a
  Socket.IO real-time channel. See its README.
- `docs/` — functional use cases and architecture/workflow notes.

## Design source & known limitation
Built from the Figma Make project "SafeCampus App Design"
(`figma.com/make/UqeFKtWomCAgJ6tz2Rns2W`). Neither a connected Figma MCP
server nor an authenticated render of the Make canvas was available in
this session — only the file's public cover thumbnail (the login
screen) could be fetched. That thumbnail drove the visual tokens in
`frontend/src/theme`; every other screen follows the same visual
language but was not checked pixel-by-pixel against a real design.
Reconnect Figma MCP and re-run to pull exact screens/tokens and close
that gap.

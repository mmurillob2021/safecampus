# SafeCampus Backend

Node.js + Express + TypeScript + Prisma (PostgreSQL) API with a
Socket.IO channel for real-time SOS alerts and notifications.

## Setup

```bash
npm install
cp .env.example .env   # fill DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

API runs on `http://localhost:4000`, mounted under `/api`.
See `../docs/use-cases.md` for the functional use cases each module
implements, and `../docs/workflow.md` for architecture notes.

## Roles
`STUDENT` (default), `SECURITY`, `ADMIN`. Promote a user's role directly
in the database for local testing; there is no self-service admin UI.

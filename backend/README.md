# SafeCampus Backend

Node.js + Express + TypeScript + Prisma (SQLite) API with a
Socket.IO channel for real-time SOS alerts and notifications.

## Setup

```bash
npm install
cp .env.example .env   # set JWT_SECRET; DATABASE_URL defaults to file:./dev.db
npx prisma migrate dev # creates prisma/dev.db, applies migrations and runs the seed
npm run dev
```

API runs on `http://localhost:4000`, mounted under `/api`.
See `../docs/use-cases.md` for the functional use cases each module
implements, and `../docs/workflow.md` for architecture notes.

## Database (SQLite)
- The database is a single file, `prisma/dev.db` (ignored by git).
- `npm run prisma:seed` loads demo users, parameter tables and sample
  institutional alerts. It is idempotent and never overwrites values an
  admin changed.
- To start from scratch: `npx prisma migrate reset`.
- To browse the data: `npx prisma studio`.
- SQLite has no enums in Prisma 5, so `role`, `status` and similar columns
  are strings. Allowed values live in `src/types/domain.ts`.

## Config module (`/api/config`)
Parameter tables the app reads instead of hard-coded arrays:

| Table key             | Model              | Used by                          |
|-----------------------|--------------------|----------------------------------|
| `incident-categories` | `IncidentCategory` | Incident report form             |
| `severity-levels`     | `SeverityLevel`    | Incidents and institutional alerts |
| `safety-points`       | `SafetyPoint`      | Map and safety-point search      |
| `official-contacts`   | `OfficialContact`  | Contacts screen, SOS fallback calls |
| `settings`            | `AppSetting`       | Campus name/status, map center   |

- `GET /api/config` (any signed-in user): active rows + settings.
- `GET /api/config/tables` (ADMIN): table metadata (fields, types, labels).
- `GET|POST /api/config/tables/:table` and
  `PATCH|DELETE /api/config/tables/:table/:id` (ADMIN): CRUD.

Rows referenced by incidents or alerts cannot be deleted; deactivate them
with `active = false` instead. To add a new parameter table, create the
Prisma model and register it in `src/modules/config/config.registry.ts`;
the API validation and the admin screens in the app are built from that
registry.

## Roles
`STUDENT` (default), `SECURITY`, `ADMIN`. The seed creates one user per
role (`student@`, `security@`, `admin@safecampus.dev`, password
`Test1234!`). ADMIN users see a **Configuración** button in the Profile
tab to manage the parameter tables.

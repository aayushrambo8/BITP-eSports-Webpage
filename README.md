# BITPeSports Website

Next.js App Router website with a small Prisma-backed content manager. Frontend code lives in `src/frontend`, backend services and database schema live in `src/backend`, and the local SQLite database lives in `database`. Public pages read events, teams, rosters, committee members, matches, weekly activities, and results from the database. Club administrators manage content at `/admin`.

## Local setup

Requirements: Node.js 20.9 or later and npm.

```bash
npm ci
cp .env.example .env
```

Set a unique `ADMIN_JWT_SECRET` in `.env` (for example, generate one with `openssl rand -base64 48`). Keep `.env` private; it is ignored by Git. Then initialize the local SQLite database and create an admin account:

```bash
npm run db:generate
npm run db:push
```

Put `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` in `.env` temporarily, then run:

```bash
npm run admin:create
```

Use a unique password of at least 14 characters and set `ADMIN_ROLE=OWNER` for the first account. Remove `ADMIN_PASSWORD` from `.env` after provisioning. To promote an existing account through the trusted CLI, use its email and set `ADMIN_ROLE=OWNER`; this invalidates its existing sessions.

Start the site with `npm run dev`, then sign in at [http://localhost:3000/admin](http://localhost:3000/admin).

## Content manager

The authenticated admin panel supports content management for events, game divisions, team rosters, committee members, achievements, matches, weekly activities, and competition results. It also provides a private contact inbox. Owners can invite users and assign roles; invitations and forgotten-password links are single-use and expire after 30 minutes. Users can also change their password after signing in.

Roles are enforced by server-side API authorization: `OWNER` manages users and all content/inbox data, `ADMIN` manages content and the contact inbox but not accounts, and `EDITOR` can create/edit content but cannot delete content or access the inbox. An active owner must always remain.

## Frontend image assets

Frontend images are stored locally under `src/frontend/public/resources` and served from `/resources/...`; the site does not fetch the displayed photos or game artwork from remote image hosts. Add future frontend image assets to this folder and reference them with a `/resources/...` path.

Public content endpoints are read-only. All content mutations use same-origin admin API routes protected by the signed, HTTP-only admin session cookie. Contact submissions are saved in the database and are not publicly readable.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Prisma database URL. SQLite is used; local default is `file:../../../database/dev.db` relative to the Prisma schema. |
| `ADMIN_JWT_SECRET` | Yes | Random session-signing secret, at least 32 characters. Use a different secret per environment. |
| `ADMIN_EMAIL` | Only when creating an admin | Initial administrator email. Do not leave bootstrap values configured after setup. |
| `ADMIN_NAME` | Only when creating an admin | Initial administrator display name. |
| `ADMIN_PASSWORD` | Only when creating an admin | Initial password, 14–72 UTF-8 bytes; remove after account creation. |
| `ADMIN_ROLE` | Only when provisioning/promoting through CLI | `OWNER`, `ADMIN`, or `EDITOR`; defaults to `OWNER`. |
| `RESEND_API_KEY` | Required for invitations/reset links; optional otherwise | Resend API credential. |
| `AUTH_FROM_EMAIL` | Required for invitations/reset links | Verified Resend sender for account emails. Falls back to `CONTACT_FROM_EMAIL`. |
| `APP_BASE_URL` | Required for invitations/reset links | Public HTTPS URL used to generate password links, e.g. `https://club.example.org`. |
| `CONTACT_FROM_EMAIL` | Optional with Resend | Verified sender address for contact notifications and as a fallback account sender. |
| `CONTACT_TO_EMAIL` | Optional with Resend | Club inbox receiving notifications. |

If contact-notification settings are absent, contact messages remain stored in the admin inbox. Do not enable user invitations or rely on reset links until `RESEND_API_KEY`, `AUTH_FROM_EMAIL` (or `CONTACT_FROM_EMAIL`), and `APP_BASE_URL` are configured.

## Database and operations

SQLite is simple for development and a single self-hosted production instance with a persistent disk. The production disk must persist the database file across deploys and restarts, and only one application instance should write to it. Ephemeral/serverless filesystems or multiple app instances are not suitable for this SQLite setup; use a managed PostgreSQL database before deploying in those environments and update the Prisma provider/schema accordingly.

Back up the SQLite database before deploys and regularly in production. For example, with the SQLite CLI:

```bash
sqlite3 database/dev.db ".backup database/backup.db"
```

Restore by stopping the app, preserving the current database file, and copying the backup over the configured SQLite file before restarting. Store backups outside the web root and test restores periodically.

The Prisma schema is `src/backend/prisma/schema.prisma`; its SQLite URL resolves to `database/dev.db`. After schema changes, run `npm run db:generate` and `npm run db:push`. For production, take a verified backup before schema changes. Do not use `db:push` against production without reviewing the schema change and backup first.

## Security and deployment

- Admin passwords are bcrypt-hashed; session tokens are signed, short-lived, HTTP-only, SameSite cookies with Secure enabled in production. Role, account-active state, and auth-version are rechecked against the database on every protected request.
- Reset/invitation tokens are cryptographically random, stored only as hashes, single-use, expire after 30 minutes, and revoke existing sessions after a password update.
- Admin APIs enforce server-side authorization, body size limits, field validation, safe errors, and same-origin checks for mutations.
- Login and public contact endpoints are rate-limited. Contact submissions have length/email checks and short-window duplicate protection.
- Security response headers include MIME sniffing and framing protections, a restrictive referrer policy, permissions policy, and production HSTS. No cross-origin API access is enabled.
- Contact messages can include personal information; restrict admin access and database/backups accordingly.
- A content security policy is not configured because the existing frontend uses inline styles and externally hosted fonts; add one only after testing a policy against the deployed site.
- Configure HTTPS at the hosting platform/reverse proxy. Ensure its proxy overwrites forwarding headers used for client IP rate limiting.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

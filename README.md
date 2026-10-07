# BITPeSports Website

Next.js App Router website with a small Prisma-backed content manager. Frontend code lives in `src/frontend`, backend services and the PostgreSQL schema live in `src/backend`. Public pages read events, teams, rosters, committee members, matches, weekly activities, and results from the database. Club administrators manage content at `/admin`.

## Local setup

Requirements: Node.js 20.9 or later and npm.

```bash
npm ci
cp .env.example .env
```

Set `DATABASE_URL` to a Prisma Postgres connection string and set a unique `ADMIN_JWT_SECRET` in `.env` (for example, generate one with `openssl rand -base64 48`). Keep `.env` private; it is ignored by Git. Then initialize the database schema and create an admin account:

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
| `DATABASE_URL` | Yes | Prisma Postgres connection string (`postgres://...` or `postgresql://...`). |
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

The application uses Prisma Postgres. Set `DATABASE_URL` in the Vercel project’s production environment and in the ignored local `.env` for local development. Do not commit or paste the connection string into source control.

The Prisma schema is `src/backend/prisma/schema.prisma`. Run `npm run db:generate`, then review and apply the schema with `npm run db:push`. Run the schema push only after configuring `DATABASE_URL` to the intended database; back up production data before future schema changes. A newly created database starts empty, so provision an Owner account and add public content through the admin panel.

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

# BITPeSports Website

Next.js App Router website with a small Prisma-backed content manager. Frontend code lives in `src/frontend`, backend services and the PostgreSQL schema live in `src/backend`. Public pages read events, teams, rosters, committee members, matches, weekly activities, and results from the database. Club administrators manage content at `/admin`.

## Local setup

Requirements: Node.js 20.9 or later and npm.

```bash
npm ci
cp .env.example .env
```

Follow the production setup below to get the Prisma Postgres connection string and put it in `DATABASE_URL` in `.env`. Keep `.env` private; it is ignored by Git.

```bash
npm run db:generate
npm run db:push
```

Set `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD` (14–72 UTF-8 bytes), and `ADMIN_ROLE=OWNER` in `.env` temporarily, then run:

```bash
npm run admin:create
```

Remove `ADMIN_PASSWORD` from `.env` after provisioning. To promote an existing account through the trusted CLI, use its email and set `ADMIN_ROLE=OWNER`; this invalidates its existing sessions.

Start the site with `npm run dev`, then sign in at [http://localhost:3000/admin](http://localhost:3000/admin).

## Production setup (Vercel + Prisma Postgres)

The Next.js app includes the backend API routes, so deploy the whole application to Vercel. No separate Render service is needed for the current architecture.

### 1. Copy the Prisma Postgres connection strings

1. Sign in to [Prisma Console](https://console.prisma.io/) and open the workspace/project containing your `claret-tree` Prisma Postgres database.
2. Select the `claret-tree` database.
3. Find the connection string for the database. If you are using the Vercel integration, it may already have set `DATABASE_URL` in the Vercel project.
4. Set the PostgreSQL connection string as `DATABASE_URL` locally and in Vercel. Treat it as a password: do not paste it in chat, commit it, or put it in frontend code.

### 2. Create the database tables and initial Owner account

On your development computer, put the connection string in the ignored root `.env`:

```dotenv
DATABASE_URL="paste-the-connection-string-here"
```

From the repository root, create the tables:

```bash
npm ci
npm run db:generate
npm run db:push
```

Then temporarily add `ADMIN_EMAIL`, `ADMIN_NAME`, `ADMIN_PASSWORD`, and `ADMIN_ROLE=OWNER` to `.env` and run `npm run admin:create`. Use a unique password of at least 14 characters and no more than 72 UTF-8 bytes. Remove `ADMIN_PASSWORD` when the account is created. The initial database has no content records; add them after signing in at `/admin`.

### 3. Add server environment variables in Vercel

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → select the BITPeSports project → **Settings** → **Environment Variables**.
2. Add each variable to the **Production** environment (also add it to **Preview** only if preview deployments should use the production database; preferably use a separate preview database).
3. Add:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | Prisma Postgres connection string |
| `ADMIN_JWT_SECRET` | Unique random secret, at least 32 characters. Generate locally with `openssl rand -base64 48`. |
| `APP_BASE_URL` | The deployed HTTPS origin, e.g. `https://your-project.vercel.app` (no trailing path). |
| `RESEND_API_KEY` | Resend API key; required for invitations and password resets. |
| `AUTH_FROM_EMAIL` | Sender using your verified domain, e.g. `BITPeSports <accounts@your-domain.example>`. |

The Prisma database connection strings and `ADMIN_JWT_SECRET` must remain server-only. Never prefix them with `NEXT_PUBLIC_`.

### 4. Configure Resend email

1. In the [Resend Dashboard](https://resend.com/), open **Domains** → **Add Domain** and add a domain or subdomain you control.
2. Add the DNS records Resend provides at your domain registrar/DNS host, then wait until the domain shows as verified.
3. Open **API Keys** → **Create API Key**. Copy it once and add it to Vercel as `RESEND_API_KEY`.
4. Set `AUTH_FROM_EMAIL` to an address on that verified domain. Account invitations and password resets use it.

For contact-form email notifications, also add `CONTACT_FROM_EMAIL` (verified sender) and `CONTACT_TO_EMAIL` (club inbox) in Vercel. Contact submissions are stored in the database even if notification email is not configured.

### 5. Deploy and sign in

Save Vercel variables, then open **Deployments** and redeploy the latest successful Git commit (or push the setup changes to the connected GitHub branch). Once deployment succeeds, visit `https://your-domain/admin` and sign in using the initial Owner email and password. Use the **User accounts** tab to invite other people and assign privileges; do not create accounts by sharing the Owner password.

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

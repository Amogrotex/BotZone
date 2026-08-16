# BotZone

Persian bot and digital-item marketplace with a Cloudflare Worker backend deployed by GitHub Actions.

## Architecture

- **Cloudflare Worker**: permanent API and static-site host
- **Cloudflare D1**: product database and login rate-limit state
- **GitHub Actions**: builds, validates, migrates, and deploys the Worker
- **Administrator authentication**: PBKDF2 password hash plus short-lived HMAC sessions
- **GitHub Pages**: retained as a temporary fallback deployment

A GitHub Actions runner is not the backend. The workflow deploys the persistent backend to Cloudflare.

## API security

- No plaintext administrator password is stored in Git or browser JavaScript.
- Passwords are verified against PBKDF2-SHA256 with at least 100,000 iterations.
- Session tokens are signed at the edge and expire after eight hours.
- Five failed login attempts trigger a 15-minute IP-based lockout.
- Product input is length-, type-, and range-validated.
- All SQL uses bound parameters.
- Cross-origin browser mutation requests are denied.
- Cloudflare deployment credentials remain encrypted GitHub Actions secrets.

No system is literally unhackable. Use a unique password, enable MFA on GitHub and Cloudflare, rotate exposed keys, and keep dependencies updated.

## One-time Cloudflare setup

### 1. Create the D1 database

Create a D1 database named `botzone` in the Cloudflare dashboard or with Wrangler:

```bash
npx wrangler login
npx wrangler d1 create botzone
```

Copy the returned database ID.

### 2. Generate administrator credentials locally

Do not use a password previously posted in chat.

```bash
npm run worker:hash-password
npm run worker:session-secret
```

The first command requests a hidden password and prints a safe PBKDF2 hash. The second prints a random session-signing secret.

### 3. Add GitHub Actions secrets

Open **GitHub repository → Settings → Secrets and variables → Actions** and add:

| Secret | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Scoped token with Workers Scripts Edit and D1 Edit permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `CLOUDFLARE_D1_DATABASE_ID` | Database ID from step 1 |
| `ADMIN_EMAIL` | Private administrator email |
| `ADMIN_PASSWORD_HASH` | Output of `npm run worker:hash-password` |
| `SESSION_SECRET` | Output of `npm run worker:session-secret` |

Never put these values in source files or chat.

### 4. Deploy

The workflow template `deployment/deploy-cloudflare.workflow.yml` automatically:

1. Installs locked dependencies.
2. Type-checks the frontend and Worker.
3. Builds the website for same-origin hosting.
4. Applies D1 migrations.
5. Deploys the API and website to Cloudflare Workers.

After granting the GitHub connection workflow permission, copy the template to `.github/workflows/deploy-cloudflare.yml`, then run **Deploy BotZone to Cloudflare** under the repository's Actions tab.

## Routes

- `/` — storefront
- `/admin/` — administrator login and product management
- `/api/health` — backend health check
- `/api/products` — active public products
- `/api/admin/*` — signed-session administrator API

The catalog starts empty. Products become public only after the administrator creates and activates them.

## Local validation

```bash
npm ci
npm run build
npm run worker:check
npm audit
```

For local Worker development, replace the D1 placeholder in a local copy of `worker/wrangler.jsonc`, create `worker/.dev.vars` containing local-only administrator secrets, then run:

```bash
npm run worker:dev
```

`worker/.dev.vars` is ignored by Git and must never be committed.

# BotZone Backend + Database

Private backend that makes your repo safe to share: **cloners CAN'T access your real files, tokens or database**.

## How it protects files?

1. **`.env` is gitignored** - contains `MONGODB_URI`, `JWT_SECRET`, `FILE_ENCRYPTION_KEY`, `GOOGLE_CLIENT_SECRET`. Never committed.
2. **`storage/` and `uploads/` are gitignored** - all uploaded bot files are encrypted and stored in `./storage/encrypted` which is NOT in git. Someone cloning repo gets empty folder.
3. **Encryption at rest** - files are encrypted with AES-256-GCM using key from `.env`. Even if someone steals `storage/` files, they are unreadable without key.
4. **Database not in repo** - MongoDB is external (Atlas). Cloner has no data.
5. **API protected by JWT** - all `/api/bots` routes need `Authorization: Bearer <token>`. No token = no access.
6. **Repo can be public**, but secrets stay private.

### If someone clones your repo, what do they get?
- ✅ Frontend source (React) - ok to share
- ✅ Backend source (Express) - but without `.env`, it won't run
- ❌ NO database - they have no MONGODB_URI
- ❌ NO uploaded files - `storage/` is gitignored
- ❌ NO bot tokens - tokens stored encrypted in DB, not in code
- ❌ NO JWT secret - can't forge tokens
- ❌ NO file encryption key - can't decrypt even if they get encrypted files

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env with real values:
# - MONGODB_URI from https://cloud.mongodb.com (free)
# - JWT_SECRET: openssl rand -base64 32
# - FILE_ENCRYPTION_KEY: openssl rand -hex 32

npm run dev # http://localhost:3001
```

### 2. Frontend (connect to backend)

In main frontend `.env` (root):
```
VITE_API_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your_google_id
```

Update `src/lib/api.ts` to use `VITE_API_URL`.

### 3. Make repo private (optional extra protection)

If you *really* don't want anyone to see code:
- GitHub → Settings → Danger Zone → Change visibility → Private

But even if public, secrets are safe because `.env` is gitignored.

## API Endpoints (all protected)

- `POST /api/auth/signup` - create account
- `POST /api/auth/login` - login, returns JWT
- `POST /api/auth/google` - Google OAuth (verify on backend)
- `GET /api/auth/me` - current user (needs Bearer token)
- `PATCH /api/auth/me` - update profile name/avatar (needs Bearer token)
- `PATCH /api/auth/password` - change or set password (needs Bearer token)
- `GET /api/bots` - list own bots
- `POST /api/bots` - create bot (token encrypted)
- `POST /api/bots/:id/files` - upload private file (encrypted, stored in gitignored folder)
- `GET /api/bots/:id/files/:fileId/download` - download (only owner)

## Deploy backend

- **Render.com** / **Railway.app** / **Fly.io** / **Vercel** (serverless)
- Set env vars in dashboard (copy from .env)
- Frontend on GitHub Pages stays static, calls backend via `VITE_API_URL`

## How to block access even more?

If you want repo to be completely unusable when cloned:

1. Put core logic in backend only, frontend is just UI that calls API
2. Keep all sensitive prompts, bot logic, private data in DB, not in code
3. Use license: Add `LICENSE` with proprietary notice
4. Enable GitHub private repo + add collaborators only

Example `LICENSE`:
```
Proprietary - All rights reserved. Cloning is allowed for viewing but not for running without permission.
Private files, tokens, and data are not included.
```

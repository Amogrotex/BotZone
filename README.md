# BotZone - ربات‌های هوشمند سروش

Modern dark UI + Full-stack with protected backend.

**Live:** https://Amogrotex.github.io/BotZone/

## Structure

- `src/` - Frontend (React + Vite + Tailwind + Framer Motion) -> deployed to GitHub Pages (`/docs`)
- `server/` - **Private backend** (Express + MongoDB + JWT + AES-256 encryption) -> NOT accessible to cloners

## 🔒 How files are protected when someone clones repo?

This repo can be public, but **cloners CAN'T access your real data**:

| What cloner gets | What they DON'T get |
|---|---|
| ✅ Frontend React code | ❌ `.env` files (gitignored) |
| ✅ Backend source code (no secrets) | ❌ `MONGODB_URI` - no database |
| ✅ Empty `server/storage/` folder | ❌ Encrypted bot files (gitignored, stored outside git) |
| ✅ Dummy `.env.example` | ❌ `JWT_SECRET`, `FILE_ENCRYPTION_KEY` |
| ✅ UI only | ❌ Real bot tokens (encrypted in DB) |

### Protection layers:
1. **`.env` gitignored** - all secrets in `.env` (frontend and `server/.env`) never committed
2. **`server/storage/` & `uploads/` gitignored** - private files are encrypted and stored outside git
3. **AES-256-GCM encryption** - even if someone steals storage, need 32-byte hex key from `.env`
4. **MongoDB external** - data lives in Atlas, not in repo
5. **JWT auth** - `/api/bots` requires `Bearer token`, no token = 403
6. **Make repo private** (optional): GitHub → Settings → Change visibility → Private

## Quick Start

### Frontend only (GitHub Pages)
```bash
npm install
npm run dev # http://localhost:5173/BotZone/
npm run build # outputs to dist/ -> copy to docs/ for GitHub Pages
```

### Full-stack with backend + database
```bash
# 1. Backend
cd server
npm install
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET (openssl rand -base64 32), FILE_ENCRYPTION_KEY (openssl rand -hex 32), GOOGLE_CLIENT_ID
npm run dev # http://localhost:3001

# 2. Frontend (in another terminal, root)
npm install
# Create .env with VITE_API_URL=http://localhost:3001/api and VITE_GOOGLE_CLIENT_ID
npm run dev
```

## Backend API (protected)

- `POST /api/auth/signup`, `/login`, `/google`, `GET /me`
- `GET /api/bots` (needs JWT)
- `POST /api/bots` (creates bot, token encrypted)
- `POST /api/bots/:id/files` (upload -> encrypted, stored in gitignored storage)
- `GET /api/bots/:id/files/:fileId/download` (only owner, decrypts on fly)

See `server/README.md` for full docs.

## Deploy

- Frontend: Already on GitHub Pages from `main` `/docs` folder (multi-file build)
- Backend: Deploy `server/` to Render/Railway/Fly.io, set env vars from `.env`

## License

Proprietary - source visible for learning, but private data, tokens, and encrypted files are not included and not usable without permission and env keys.

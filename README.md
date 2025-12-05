# Digital Wallet - Starter Repo

This repository is a compact starter for a digital wallet accessible from Android (mobile browser) and PC (desktop browser). It includes:
- **backend/**: Node + Express API with JWT auth and a tiny file-based DB (for quick local testing). Replace with Postgres in production.
- **web/**: React (Vite) single-page app that works as a PWA on mobile and desktop.

This is intentionally minimal: it provides register/login, wallets list, create wallet, and send-to-user (internal transfer). Use it to prototype and iterate.

## Quick summary (short)
1. Open two terminals.
2. Run backend: `cd backend && npm install && npm run dev` (server on http://localhost:4000)
3. Run web: `cd web && npm install && npm run dev` (web on http://localhost:5173)
4. Register two users and send money between them.

Full detailed instructions are in the repository files.

# Functional Web App Demo — Type A (full-stack)

Built for the r/SideHustlesIndia lead (u/xdyl3rx0) who wants a website cloned and made fully functional with a real backend, explicitly "no vibe coders."

## Live Demo
https://slavh.github.io/functional-webapp-demo/

## Files
- `index.html` — working SPA: login (role-based session), filtered task list, live CRUD, add/edit/delete, stats. Persistence via a swappable Store layer.
- `server.js` — reference zero-dependency Node REST backend: `/api/login`, `/api/me`, `/api/items` CRUD, auth middleware, health check. Maps 1:1 to the Store interface in the front end.
- `styles.css` — responsive styling
- `README.md` — this file

## Why this fits the brief
The lead's ask: take a static site and make the backend functional. This demo shows the full path:
1. A real front end with working auth, session, CRUD, and permissions — not a mockup.
2. A clean data layer (`Store`) whose methods (login/list/add/update/remove) map directly to REST endpoints in `server.js`.
3. Auth-protected API with token sessions and role checks.
4. Data persists across reloads (localStorage stands in for the DB; swap for Postgres/Mongo in production).

## Run locally
```bash
# Front end: open index.html, or serve the folder
python3 -m http.server 8000

# Backend (optional, for the real API):
node server.js        # http://localhost:3000
# Demo login: admin@demo.dev / demo123
```

## Price note
Quoted within the lead's budget; floor is now $20 (user confirmed 2026-11-18).

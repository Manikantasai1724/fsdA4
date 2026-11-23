# SmartScheduler

SmartScheduler is a React, TypeScript, Vite, and Express migration of the original static academic scheduling website. The existing visual language and client-side scheduling behavior are retained while pages are now routed components instead of separate HTML documents.

## Structure

- `client/` — Vite React TypeScript application with routed pages, shared data, and reused styling
- `server/` — typed Express API with health and catalog endpoints
- `client/legacy/` — preserved original `.html`, `script.js`, and `styles.css` files as a reference/rollback checkpoint

The current site has no feature requiring durable records or authentication. Therefore the catalog remains static and the API does not introduce unnecessary MongoDB persistence. `MONGODB_URI` is reserved in `.env.example` for the first feature that needs database-backed data.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

The client runs at `http://localhost:5173`; the API runs at `http://localhost:4000`.

## Validation and production build

```bash
npm run typecheck
npm run build
npm start
```

The API exposes `GET /api/health` and `GET /api/catalog`. Configure `PORT` and `CLIENT_ORIGIN` through environment variables.

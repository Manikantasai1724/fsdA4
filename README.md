# SmartScheduler

SmartScheduler is a React, TypeScript, Vite, and Express migration of the original static academic scheduling website. The existing visual language and client-side scheduling behavior are retained while pages are now routed components instead of separate HTML documents.

## Structure

- `client/` — Vite React TypeScript application with routed pages, shared data, and reused styling
- `server/` — typed Express API with health and catalog endpoints
- `client/legacy/` — preserved original `.html`, `script.js`, and `styles.css` files as a reference/rollback checkpoint

Catalog data is MongoDB-backed when `MONGODB_URI` is configured. The server seeds the existing academic catalog on first connection and otherwise falls back safely to the typed static catalog.

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

## Local development

```bash
npm install
copy .env.example .env
npm run dev
```

- React app: `http://localhost:5173`
- Express API: `http://localhost:4000`
- API proxy: Vite forwards `/api` requests to Express

For an optional MongoDB connection, set `MONGODB_URI` in `.env`. Leave it empty to use the built-in static fallback catalog.

## Deployment

### Single-service deployment

Build both applications and start Express:

```bash
npm install
npm run build
npm start
```

Configure these environment variables on the hosting platform:

- `PORT` — supplied automatically by most Node hosts
- `MONGODB_URI` — optional MongoDB Atlas connection string
- `CLIENT_ORIGIN` — set to the deployed public URL when frontend and API use separate origins

When `client/dist` exists, Express serves the production React app and `/api/*` routes from the same port.

### Recommended split deployment

1. Deploy `client/dist` to a static host such as Netlify or Vercel.
2. Configure the static host to redirect non-file routes to `index.html`.
3. Deploy `server/` to Render, Railway, or another Node.js host.
4. Set `CLIENT_ORIGIN` on the server to the exact frontend URL.
5. Set `MONGODB_URI` to the MongoDB Atlas connection string.
6. Configure the frontend host to proxy `/api/*` to the server URL, or replace `/api` usage with `VITE_API_URL` for a cross-origin deployment.

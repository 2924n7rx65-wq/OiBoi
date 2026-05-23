# Leapfrog

> Real-time competitor radar for small local businesses. Watch what the shops on your block are doing — promos, pricing moves, viral posts — surfaced the morning they go live with plain-English suggestions on how to stay one step ahead.

A Next.js 15 + TypeScript app with fabricated demo data so the full flow (home → onboarding → analytics) works end-to-end without any external services.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production build:

```bash
npm run build
npm run start
```

## Tech

- **Next.js 15** (App Router) + TypeScript
- **React 18**
- **Tailwind-less** — design tokens via `app/globals.css`
- **Spectral** (headings) + **Manrope** (body) loaded via `next/font`
- **react-leaflet 4** + Leaflet for the competitor map (with CARTO light tiles)
- **recharts** for engagement & posting-volume charts
- **framer-motion** for the homepage scroll animation

No env vars required, no external APIs. All data is seeded JSON + a deterministic generator (`lib/seed-generator.ts`).

## Routes

| Route | What it does |
|---|---|
| `/` | Marketing hero with scroll-pinned dashboard preview |
| `/home` | Pick one of four test businesses to "log in" as (gym, restaurant, cafe, retail) |
| `/onboarding` | Two-step form: business details → map + competitor selection |
| `/analytics` | Intelligence Hub — feed, charts, market map, recommended actions |
| `/competitors` | Local rivals + inspiration accounts |

## API

All routes are unauthenticated. Session is a cookie (`sf_business`) holding the current test business id.

| Method | Path | Notes |
|---|---|---|
| GET | `/api/businesses` | List the 4 seeded test businesses |
| GET / PATCH | `/api/businesses/:id` | Read or update a business (onboarding PATCHes here) |
| GET / POST / DELETE | `/api/session` | Cookie-based "log in" / "log out" |
| GET | `/api/competitors?businessId=` | `{ local, inspiration }` lists |
| GET | `/api/competitors/:id` | Competitor detail with posts & signals |
| GET | `/api/analytics?businessId=` | Initiatives feed, weekly engagement & post volume, top movers |

## Test businesses

| ID | Name | Niche | Location |
|---|---|---|---|
| `gym-001` | Club Vitality | Gym | Brisbane |
| `restaurant-001` | August Restaurant | Restaurant | Brisbane |
| `cafe-001` | Kin & Co | Cafe | Brisbane |
| `retail-001` | RSPCA Op Shop New Farm | Op-shop / retail | Brisbane |

## How the demo data works

- `data/seed/businesses.json` and `data/seed/competitors.json` are static.
- Posts + signals are generated deterministically on first import by `lib/seed-generator.ts` (seeded RNG per competitor id, ~12 weeks of weekly posts, one designated viral spike per competitor).
- Recent weeks bias toward high-importance signals so the initiatives feed always has something punchy.

## Hosting

This is a standard Next.js 15 app. To deploy:

- **Vercel** — `vercel deploy`, no config needed.
- **Lovable** — import this repo, hit "Publish".
- **Anywhere else** — `npm run build && npm run start` gives you a Node server on port 3000.

Note: the in-memory store (`lib/store.ts`) mutates on `PATCH /api/businesses/:id`. On serverless hosts those mutations don't survive cold starts — the demo flow is designed to work within a single warm session.

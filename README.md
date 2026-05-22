# ScoutFeed MVP

Next.js 15 + TypeScript. Backend serves fabricated competitor data so the frontend team can build `/home`, `/onboarding`, `/competitors`, `/analytics` without waiting on the real scraper.

## Run

```bash
npm install
npm run dev
```

Server runs on `http://localhost:3000`.

## API

All routes are unauthenticated. Session is a cookie (`sf_business`) that holds the currently-logged-in test business id.

| Method | Path | Notes |
|---|---|---|
| GET | `/api/businesses` | List the 4 seeded test businesses (gym, restaurant, cafe, retail). |
| GET | `/api/businesses/:id` | Single business. |
| PATCH | `/api/businesses/:id` | Onboarding writes `{ niche, businessType, location, name }`. Sets `onboarded: true` once niche+location are set. |
| GET | `/api/session` | `{ businessId, business }` for current cookie. |
| POST | `/api/session` | Body: `{ businessId }`. Sets the session cookie. |
| DELETE | `/api/session` | Clears the cookie. |
| GET | `/api/competitors?businessId=` | `{ local: [...], inspiration: [...] }`. Each item has `signalCount`, `lastSignalAt`. |
| GET | `/api/competitors/:id` | `{ competitor, posts: [{ ..., signal }] }`. |
| GET | `/api/analytics?businessId=` | `{ initiatives, engagement, postsPerWeek, topMovers }`. **Initiatives** is the headline list — promos/discounts/launches/referrals competitors are running right now (this is the "undercut" feed). |

## Test business IDs

`gym-001`, `restaurant-001`, `cafe-001`, `retail-001`.

## Data shape

See `lib/types.ts` for the full TypeScript types — import from `@/lib/types`.

## How the fake data works

- `data/seed/businesses.json` + `data/seed/competitors.json` are static.
- Posts + signals are deterministically generated at module load from `lib/seed-generator.ts` (seeded RNG per competitor id, ~8 posts each over ~6 weeks).
- Recent weeks are biased toward high-importance signals so the initiatives feed always has something punchy.

## Swapping in Firebase later

The store interface (`lib/store.ts`) is the only file that needs to change. API routes only depend on its exported functions.

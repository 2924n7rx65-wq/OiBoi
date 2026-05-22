# ScoutFeed — Technical Implementation Plan

## 1. Architecture overview

Scheduled scraping + LLM-extraction pipeline behind a thin Next.js SaaS. Cron-driven worker pulls public competitor posts → raw payloads to Postgres → AI worker extracts structured signals → weekly job composes digest email + dashboard view. Reuse the existing IG/LinkedIn scraper (Playwright + engagement parser); strip LinkedIn, keep IG, bolt on a new normalizer.

```
[Owner] -> [Next.js dashboard] -> [Postgres: competitors, signals]
                                       ^
[Cron (Vercel)] -> [QStash queue] -> [Playwright workers (Fly machine)]
                                            |
                                     [raw_posts table]
                                            |
                              [AI extractor (Claude Sonnet 4.7)]
                                            |
                                     [signals table]
                                            |
              [Weekly digest job] -> [Resend email] + [/digest/[id]]

[Clerk auth]   [Stripe billing]
```

**Stack**: Next.js 16 on Vercel · Neon Postgres · Upstash QStash · Playwright on Fly.io · Claude Sonnet 4.7 (extraction) + Haiku 4.5 (prefilter) · Clerk · Stripe · Resend.

## 2. Data model

- **users** — id, clerk_id, email, created_at
- **businesses** — id, owner_user_id, name, industry, timezone, plan_tier
- **competitor_profiles** — id, business_id, platform, handle, profile_url, baseline_engagement, last_scraped_at, active
- **scrape_runs** — id, competitor_profile_id, started_at, finished_at, status, posts_found, error
- **raw_posts** — id, competitor_profile_id, platform_post_id (unique), captured_at, posted_at, caption, media_urls[], ocr_text, like_count, comment_count, raw_json
- **signals** — id, raw_post_id, business_id, signal_type, summary, evidence_quote, confidence, engagement_score, importance
- **digests** — id, business_id, week_start, week_end, status, html, sent_at
- **subscriptions** — id, business_id, stripe_customer_id, tier, status, current_period_end

## 3. Scraping pipeline

**MVP platform: Instagram.** Highest signal density for ICP, strong visual cues for new products/promos, we already have a working scraper. FB Pages have collapsed organically; GBP API requires verified ownership.

- **No Meta Graph API for competitors** — it only exposes accounts you own. Public profile scraping via **Playwright** against `instagram.com/{handle}`, logged-out, mobile UA.
- **Anti-blocking**: Bright Data residential proxies (~$15 for 1 GB), 1 req / 8–12s with jitter, rotate session every 25 requests, exponential backoff on 429, cap 12 posts/profile/run.
- **Discipline**: public, unauthenticated endpoints only. No login, DM, or stories. Document this for judges.
- **Scheduling**: Vercel Cron every 6h enqueues one QStash job per active competitor_profile. Postgres unique index `(competitor_profile_id, platform_post_id)` makes runs idempotent.

## 4. AI signal extraction

**Prefilter (Haiku)**: "Is this post about a business change? yes/no." Drops ~70% of posts at ~$0.001 each.

**Extractor (Sonnet 4.7) prompt**:
```
Input: caption, OCR text, posted_at, like_count, comment_count, baseline_likes.

Return JSON:
{
  "signal_type": "launch|promo|price_change|menu_change|rebrand|event|hire|location_change|other",
  "summary": "<=140 chars, plain English",
  "evidence_quote": "verbatim snippet",
  "confidence": 0.0-1.0,
  "importance": 0.0-1.0
}
```

Use Anthropic SDK with **prompt caching** on system prompt + taxonomy. OCR via Tesseract.js on the first image (catches promo flyers).

**Engagement scoring**: `z = (post_likes - baseline_mean) / baseline_stddev` over last 30 posts. Final rank = `0.6 * importance + 0.4 * sigmoid(z)`.

## 5. Digest + delivery

Vercel Cron Monday 08:00 local → pull last 7 days where `importance >= 0.4 OR engagement_score >= 1.5`, group by competitor, sort by rank, top 3 per competitor, max 5 competitors.

**Email (Resend + React Email)**:
- Header: "This week from your 5 competitors"
- Per-competitor block: avatar, handle, signal cards (type pill, summary, evidence quote, link, engagement delta)
- Footer: "Strategic take" — Claude-generated paragraph summarizing the week
- CTA: "Open dashboard"

Same HTML stored on `digests.html` and served at `/digest/[id]`.

## 6. Frontend (dashboard)

- `/onboarding` — paste IG handles, pick industry
- `/competitors` — list w/ last-scraped, signal count, pause toggle
- `/digests` — archive + detail
- `/signals/[id]` — single signal w/ raw post, summary, evidence
- `/billing` — Stripe customer portal

Built with shadcn/ui. No graphs, no team seats for MVP.

## 7. Auth + billing

- **Clerk** via Vercel Marketplace (env vars auto-provisioned)
- **Stripe Checkout** + customer portal, three products at $30/$60/$100
- Webhook `/api/stripe/webhook` updates `subscriptions` + `businesses.plan_tier`. Competitor cap enforced in onboarding action.

## 8. 48-hour build schedule

Roles: **A**=scraper, **B**=AI/digest, **C**=frontend, **D**=infra/auth/billing/demo.

| Window | A | B | C | D |
|---|---|---|---|---|
| H0–H6 | Port IG scraper, Playwright on Fly | Extraction prompt + Haiku prefilter | Next.js scaffold, shadcn, Clerk | Vercel + Neon + QStash + Resend + Stripe + schema |
| H6–H12 | QStash worker, dedup, run logging | raw_post → signals pipeline | `/onboarding` + `/competitors` | Stripe products + webhook |
| H12–H18 | Baseline engagement calc, proxies | Importance scoring + strategic take | `/signals/[id]` + `/digests` | Seed script: 8 fake businesses |
| **H24** | **end-to-end scrape → signal visible in dashboard** | | | |
| H24–H30 | Cron + retry policy | Digest renderer (React Email) | Digest detail polish | Resend domain verify |
| H30–H36 | GBP stretch | Per-competitor weekly summary | Empty/loading/error states | Demo data: 3 businesses, 12 competitors, 6 weeks |
| H36–H42 | Hardening | Tune prompts on real data | Landing + pricing | Backup demo video |
| H42–H48 | Freeze. Bug bash. Rehearse x3. | | | |

## 9. Demo strategy

**Seed**: "Bella's Coffee" monitoring 5 real public IG accounts of well-known coffee chains. 6 weeks of pre-scraped signals so the dashboard looks lived-in. One competitor has a juicy recent post — a price increase visible in a menu photo OCR caught.

**Wow moment**: On stage, paste a brand-new IG handle. Within ~45 seconds scraper finishes and 2–3 fresh signals appear with AI summaries and evidence quotes from captions the audience can verify. Then open the staged digest email on a phone — "Bella got this Monday morning. Here's the menu price hike at her biggest competitor, spotted from a photo."

## 10. Risks & cuts

**Cut order if behind**:
1. GBP + FB (IG-only is fine)
2. Strategic-take paragraph
3. Stripe — show pricing only, mock checkout
4. `/signals/[id]` page (link to source post)
5. Baseline scoring (raw like counts)

**Never cut**: scrape → extract → digest happy path.

**Failure modes**: IG login wall mid-demo → seeded data + recorded video. Proxy budget blown → throttle to 1/min. Claude rate limits → cache aggressively.

**Legal framing for judges**: public unauthenticated data only · customer authorizes monitoring of profiles they specify · no PII, no private accounts, no logged-in scraping, no stories/DMs · robots.txt + ToS acknowledged · production roadmap includes Meta partner program · position as "competitive intelligence" (Crayon, Klue category), not gray-area scraping.

# ScoutFeed — Product Brief

## One-line pitch
ScoutFeed is the competitor radar for small businesses — it watches your rivals' social feeds so you don't have to, and emails you what actually matters every Monday.

## Problem
Small business owners are competing locally but flying blind. They don't have marketing teams, and they don't have time to scroll twelve Instagram accounts every week to see what the shop down the street is up to. The cost of missing a move is real:

- A neighborhood café finds out three weeks late that the rival across the park launched a punch-card loyalty program — and 40 of their regulars have already switched.
- A boutique owner misses a competitor's Friday-to-Sunday 30% off flash sale posted only on Stories, and watches walk-in traffic drop for a weekend with no idea why.
- A gym owner doesn't notice a new studio offering a free first month two blocks away until churn spikes the following quarter.

These signals are public. They're sitting on Instagram, Facebook, and Google Business profiles. The owners just can't see them in time.

## Solution
ScoutFeed turns competitor social feeds into a structured weekly intelligence report. Owner signs up, pastes in 5–20 competitor handles, picks a refresh cadence. ScoutFeed scrapes on schedule, runs each new post through an LLM that classifies it into a signal type — **product launch, promo, price change, menu/service addition, rebrand, event, hiring** — and bundles the week into a digest delivered by email and dashboard.

Each digest entry includes: competitor, signal type, one-sentence summary, engagement vs. baseline, and a one-line strategic interpretation ("third promo this month — likely clearing inventory" or "engagement 4x their average — this resonated").

## Target customer
Small/medium businesses in dense, competitive local markets where 5–15 direct rivals are visible within a few miles: independent restaurants and cafés, boutique retail, gyms and fitness studios, salons and med-spas, dental and aesthetics clinics, small real estate teams. They buy because $50/month is cheaper than one hour of a marketing consultant.

## Core features (MVP)
Ship **Instagram-first**. Highest signal density for our verticals, rich engagement metrics, and the scraping pipeline from the sentiment pivot already handles it.

- Add up to 10 competitor IG handles per account
- Daily scrape; weekly digest (Monday 7am local)
- LLM classification into six signal types
- Engagement delta vs. that competitor's 30-day baseline
- Email digest + simple web dashboard with timeline view

## Differentiation
- **Vs. manual scrolling**: reads 70 posts, surfaces the 6 that matter, tells you why
- **Vs. enterprise tools (Brandwatch, Sprout, Meltwater)**: those are $1k–$10k/month, built for brand managers tracking national sentiment; ScoutFeed is self-serve and $50
- **Vs. hiring an analyst**: freelancer is $400+/month, inconsistent, quits

## Monetization
- **Scout — $30/mo**: 5 competitors, weekly digest, IG only
- **Pro — $60/mo**: 15 competitors, weekly + on-demand, IG + FB + GBP
- **Agency — $100/mo**: 40 competitors across 3 locations, daily alerts, API access

## Go-to-market
Attack **independent restaurants and cafés first**. They post constantly on IG, are dense in any neighborhood, talk to each other through POS communities. First 100: cold DM/email 500 restaurants in Austin/Portland/Brooklyn; partner with one POS reseller (Toast, Square) for co-marketing; free 14-day trial seeded with 5 pre-loaded local competitors.

## Risks & mitigations
- **ToS / IP blocks**: residential proxies, rate limits, prefer official APIs where available
- **Platform UI changes**: modular per-platform scrapers, parse-failure monitoring, 48h fix SLA
- **Signal quality**: confidence scoring; low-confidence items tagged "needs review"; weekly human-in-loop prompt tuning
- **Legal**: public profiles only, no login-walled content, no resale — just summaries and metrics

## Why now
Scraping pipeline already exists. LLM classification of short social posts is now a one-line API call. End-to-end demo is achievable in a weekend. Small product, sharp wedge, reachable buyer.

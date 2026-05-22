import businessesSeed from "@/data/seed/businesses.json";
import competitorsSeed from "@/data/seed/competitors.json";
import { generatePostsAndSignals } from "./seed-generator";
import type { Business, Competitor, Post, Signal } from "./types";

type StoreState = {
  businesses: Business[];
  competitors: Competitor[];
  posts: Post[];
  signals: Signal[];
};

declare global {
  // eslint-disable-next-line no-var
  var __scoutfeed_store__: StoreState | undefined;
}

function build(): StoreState {
  const businesses = JSON.parse(JSON.stringify(businessesSeed)) as Business[];
  const competitors = competitorsSeed as Competitor[];
  const { posts, signals } = generatePostsAndSignals(competitors);
  return { businesses, competitors, posts, signals };
}

const store: StoreState = globalThis.__scoutfeed_store__ ?? build();
if (!globalThis.__scoutfeed_store__) globalThis.__scoutfeed_store__ = store;

export function listBusinesses(): Business[] {
  return store.businesses;
}

export function getBusiness(id: string): Business | undefined {
  return store.businesses.find((b) => b.id === id);
}

export function updateBusiness(id: string, patch: Partial<Business>): Business | undefined {
  const b = getBusiness(id);
  if (!b) return undefined;
  Object.assign(b, patch);
  if (b.niche && b.location) b.onboarded = true;
  return b;
}

export function competitorsForBusiness(businessId: string): Competitor[] {
  return store.competitors.filter((c) => c.businessId === businessId);
}

export function getCompetitor(id: string): Competitor | undefined {
  return store.competitors.find((c) => c.id === id);
}

export function postsForCompetitor(competitorId: string): Post[] {
  return store.posts
    .filter((p) => p.competitorId === competitorId)
    .sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt));
}

export function signalsForCompetitor(competitorId: string): Signal[] {
  return store.signals.filter((s) => s.competitorId === competitorId);
}

export function signalsForBusiness(businessId: string): Signal[] {
  return store.signals.filter((s) => s.businessId === businessId);
}

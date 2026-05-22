import { NextRequest, NextResponse } from "next/server";
import {
  competitorsForBusiness,
  postsForCompetitor,
  signalsForBusiness,
} from "@/lib/store";
import type { AnalyticsResponse, SignalType } from "@/lib/types";

const INITIATIVE_TYPES: SignalType[] = [
  "promo",
  "discount",
  "launch",
  "event",
  "referral",
  "menu_change",
  "price_change",
];

function isoWeekStart(d: Date): string {
  const x = new Date(d);
  const day = x.getUTCDay();
  const diff = (day + 6) % 7; // Monday-anchored
  x.setUTCDate(x.getUTCDate() - diff);
  x.setUTCHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get("businessId");
  if (!businessId) return NextResponse.json({ error: "businessId required" }, { status: 400 });

  const competitors = competitorsForBusiness(businessId);
  const competitorName = new Map(competitors.map((c) => [c.id, c.name]));

  const allSignals = signalsForBusiness(businessId);
  const initiatives = allSignals
    .filter((s) => INITIATIVE_TYPES.includes(s.signalType))
    .sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt))
    .slice(0, 30)
    .map((s) => ({ ...s, competitorName: competitorName.get(s.competitorId) ?? "Unknown" }));

  const engagement: AnalyticsResponse["engagement"] = [];
  const postsPerWeek: AnalyticsResponse["postsPerWeek"] = [];
  const topMovers: AnalyticsResponse["topMovers"] = [];

  for (const c of competitors) {
    const posts = postsForCompetitor(c.id);
    const byWeek = new Map<string, { likes: number[]; comments: number[]; count: number }>();
    for (const p of posts) {
      const k = isoWeekStart(new Date(p.postedAt));
      const entry = byWeek.get(k) ?? { likes: [], comments: [], count: 0 };
      entry.likes.push(p.likeCount);
      entry.comments.push(p.commentCount);
      entry.count += 1;
      byWeek.set(k, entry);
    }
    const weeks = [...byWeek.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
    engagement.push({
      competitorId: c.id,
      competitorName: c.name,
      weeks: weeks.map(([weekStart, v]) => ({
        weekStart,
        avgLikes: Math.round(v.likes.reduce((a, b) => a + b, 0) / v.likes.length),
        avgComments: Math.round(v.comments.reduce((a, b) => a + b, 0) / v.comments.length),
      })),
    });
    postsPerWeek.push({
      competitorId: c.id,
      competitorName: c.name,
      weeks: weeks.map(([weekStart, v]) => ({ weekStart, count: v.count })),
    });

    const recent = posts.slice(0, 3);
    const recentAvg = recent.length
      ? recent.reduce((a, p) => a + p.likeCount, 0) / recent.length
      : c.baselineLikes;
    topMovers.push({
      competitorId: c.id,
      competitorName: c.name,
      engagementDeltaPct: Math.round(((recentAvg - c.baselineLikes) / c.baselineLikes) * 100),
    });
  }

  topMovers.sort((a, b) => b.engagementDeltaPct - a.engagementDeltaPct);

  const response: AnalyticsResponse = { initiatives, engagement, postsPerWeek, topMovers };
  return NextResponse.json(response);
}

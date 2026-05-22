import { NextRequest, NextResponse } from "next/server";
import { competitorsForBusiness, signalsForCompetitor } from "@/lib/store";

export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get("businessId");
  if (!businessId) return NextResponse.json({ error: "businessId required" }, { status: 400 });
  const all = competitorsForBusiness(businessId);
  const enrich = (c: (typeof all)[number]) => {
    const sigs = signalsForCompetitor(c.id);
    return {
      ...c,
      signalCount: sigs.length,
      lastSignalAt: sigs
        .map((s) => s.postedAt)
        .sort()
        .reverse()[0] ?? null,
    };
  };
  return NextResponse.json({
    local: all.filter((c) => c.tier === "local").map(enrich),
    inspiration: all.filter((c) => c.tier === "inspiration").map(enrich),
  });
}

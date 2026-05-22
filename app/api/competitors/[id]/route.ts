import { NextRequest, NextResponse } from "next/server";
import { getCompetitor, postsForCompetitor, signalsForCompetitor } from "@/lib/store";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getCompetitor(id);
  if (!c) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const posts = postsForCompetitor(id);
  const signalsByPost = new Map(signalsForCompetitor(id).map((s) => [s.postId, s]));
  return NextResponse.json({
    competitor: c,
    posts: posts.map((p) => ({ ...p, signal: signalsByPost.get(p.id) ?? null })),
  });
}

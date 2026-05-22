import { NextRequest, NextResponse } from "next/server";
import { clearSession, getSessionBusinessId, setSessionBusinessId } from "@/lib/session";
import { getBusiness } from "@/lib/store";

export async function GET() {
  const id = await getSessionBusinessId();
  if (!id) return NextResponse.json({ businessId: null, business: null });
  return NextResponse.json({ businessId: id, business: getBusiness(id) ?? null });
}

export async function POST(req: NextRequest) {
  const { businessId } = (await req.json()) as { businessId?: string };
  if (!businessId) return NextResponse.json({ error: "businessId required" }, { status: 400 });
  if (!getBusiness(businessId))
    return NextResponse.json({ error: "unknown businessId" }, { status: 404 });
  await setSessionBusinessId(businessId);
  return NextResponse.json({ businessId });
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ ok: true });
}

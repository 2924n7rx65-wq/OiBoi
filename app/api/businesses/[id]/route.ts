import { NextRequest, NextResponse } from "next/server";
import { getBusiness, updateBusiness } from "@/lib/store";
import type { Business } from "@/lib/types";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const b = getBusiness(id);
  if (!b) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(b);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json()) as Partial<Business>;
  const allowed: Partial<Business> = {};
  if (body.niche !== undefined) allowed.niche = body.niche;
  if (body.businessType !== undefined) allowed.businessType = body.businessType;
  if (body.location !== undefined) allowed.location = body.location;
  if (body.name !== undefined) allowed.name = body.name;
  const b = updateBusiness(id, allowed);
  if (!b) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(b);
}

import { NextResponse } from "next/server";
import { listBusinesses } from "@/lib/store";

export async function GET() {
  return NextResponse.json(listBusinesses());
}

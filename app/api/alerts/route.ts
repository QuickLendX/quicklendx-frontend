import { NextResponse } from "next/server";
import { MOCK_ALERTS } from "@/lib/alerts";

export async function GET() {
  return NextResponse.json({ alerts: MOCK_ALERTS });
}

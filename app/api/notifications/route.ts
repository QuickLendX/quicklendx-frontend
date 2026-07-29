import { NextResponse } from "next/server";
import { MOCK_NOTIFICATIONS } from "@/lib/notifications";

export async function GET() {
  return NextResponse.json({ notifications: MOCK_NOTIFICATIONS });
}

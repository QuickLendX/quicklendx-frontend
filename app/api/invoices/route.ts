import { NextRequest, NextResponse } from "next/server";
import { getInvoicesForUser } from "@/lib/qlx";

/**
 * GET /api/invoices?userId=<userId>
 *
 * Returns the list of invoices for the given user.
 * Used by the qlx client layer as the HTTP boundary for on-chain reads.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId query parameter is required" },
      { status: 400 }
    );
  }

  const invoices = await getInvoicesForUser(userId);
  return NextResponse.json({ invoices });
}

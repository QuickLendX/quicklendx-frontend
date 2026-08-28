import { NextRequest, NextResponse } from "next/server";
import { getInvoiceDetailsBatch } from "@/lib/qlx";

/**
 * POST /api/invoices/details
 *
 * Returns detail (risk score, funded amount) for one or more invoice IDs.
 * Body: { ids: string[] }
 *
 * Batches lookups into a single round trip.
 */
export async function POST(request: NextRequest) {
  let ids: string[];
  try {
    const body = await request.json();
    ids = body.ids;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON with an 'ids' array" },
      { status: 400 }
    );
  }

  if (!Array.isArray(ids)) {
    return NextResponse.json(
      { error: "'ids' must be an array of invoice ID strings" },
      { status: 400 }
    );
  }

  const details = await getInvoiceDetailsBatch(ids);
  const entries = Array.from(details.entries()).map(([id, detail]) => ({
    id,
    riskScore: detail.riskScore,
    fundedAmountStroops: detail.fundedAmountStroops.toString(),
  }));

  return NextResponse.json({ details: entries });
}

import { NextRequest, NextResponse } from "next/server";
import { getTransactionsForInvoice } from "@/lib/qlx";

/**
 * GET /api/invoices/transactions?invoiceId=<invoiceId>
 *
 * Returns all transactions for a given invoice.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const invoiceId = searchParams.get("invoiceId");

  if (!invoiceId) {
    return NextResponse.json(
      { error: "invoiceId query parameter is required" },
      { status: 400 }
    );
  }

  const transactions = await getTransactionsForInvoice(invoiceId);
  return NextResponse.json({ transactions });
}

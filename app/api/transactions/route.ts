import { NextResponse } from "next/server";
import { getTransactionsForInvoice } from "@/lib/qlx";

/** Serializes `bigint` amounts as decimal strings -- `JSON.stringify`
 * throws on a raw `bigint`, and the client hook parses them back with
 * `BigInt(...)` rather than `Number(...)` to avoid precision loss. */
function toJson(transactions: Awaited<ReturnType<typeof getTransactionsForInvoice>>) {
  return transactions.map((txn) => ({ ...txn, amountStroops: txn.amountStroops.toString() }));
}

export async function GET(request: Request) {
  const invoiceId = new URL(request.url).searchParams.get("invoiceId") ?? "";
  const transactions = await getTransactionsForInvoice(invoiceId);
  return NextResponse.json({ transactions: toJson(transactions) });
}

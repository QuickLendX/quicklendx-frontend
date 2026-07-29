import { NextResponse } from "next/server";
import { MOCK_TRANSACTIONS } from "@/lib/transactions";

export async function GET() {
  const transactions = MOCK_TRANSACTIONS.map((txn) => ({
    ...txn,
    amountStroops: txn.amountStroops.toString(),
  }));
  return NextResponse.json({ transactions });
}

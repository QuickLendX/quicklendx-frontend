/** Shared shape between the `/api/transactions` route handler and the
 * generated client that consumes it -- this type is the contract until a
 * formal OpenAPI schema exists. `amountStroops` is a `bigint` here (the
 * in-memory representation); the wire format is a string, since JSON has
 * no bigint -- see `lib/generated/transactionsClient.ts` for the
 * conversion at the boundary. */
export interface Transaction {
  id: string;
  invoiceId: string;
  type: "fund" | "repayment";
  amountStroops: bigint;
  createdAt: string;
}

export const MOCK_TRANSACTIONS: readonly Transaction[] = [
  {
    id: "txn_1",
    invoiceId: "inv_1001",
    type: "fund",
    amountStroops: 50_000_0000000n,
    createdAt: "2026-07-20T10:00:00.000Z",
  },
  {
    id: "txn_2",
    invoiceId: "inv_1002",
    type: "repayment",
    amountStroops: 42_500_0000000n,
    createdAt: "2026-07-25T16:45:00.000Z",
  },
];

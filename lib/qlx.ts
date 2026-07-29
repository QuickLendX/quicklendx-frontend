/**
 * The single client boundary for on-chain reads. Every place in this app
 * that needs invoice/portfolio data goes through here instead of importing
 * `soroban-sdk` directly, so the RPC/contract wiring has one place to land
 * once the escrow contract's read-only methods are available.
 */

export type InvoiceStatus = "open" | "funded" | "repaid" | "defaulted";

export interface Invoice {
  id: string;
  supplier: string;
  /** On-chain i128 stroops amount. Never convert to `number`. */
  amountStroops: bigint;
  status: InvoiceStatus;
  dueAt: string;
}

// TODO(qlx): replace with a real contract read once the escrow contract's
// invoice-listing method is deployed. Seeded here so the UI has something
// real to render against during early development.
const MOCK_INVOICES: readonly Invoice[] = [
  {
    id: "inv_1001",
    supplier: "Acme Textiles",
    amountStroops: 125_000_0000000n,
    status: "open",
    dueAt: "2026-08-15",
  },
  {
    id: "inv_1002",
    supplier: "Blue Ridge Foods",
    amountStroops: 42_500_0000000n,
    status: "funded",
    dueAt: "2026-08-02",
  },
];

/** Fetches every invoice owned by `userId`. Resolves to `[]` for a user with
 * no invoices -- callers must render an explicit empty state for that case
 * rather than leaving a blank screen. */
export async function getInvoicesForUser(userId: string): Promise<Invoice[]> {
  if (!userId) return [];
  return [...MOCK_INVOICES];
}

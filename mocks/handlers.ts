import { http, HttpResponse } from "msw";
import type { SessionResponse } from "@/lib/auth";

const SIGNED_OUT: SessionResponse = { user: null };

const SIGNED_IN: SessionResponse = {
  user: { publicKey: "GABCDEXAMPLESTELLARPUBLICKEY000000000000000000000000000" },
};

/** Default handlers for the auth endpoints, used by every test unless a
 * specific test overrides one with `server.use(...)`. Defaults to
 * signed-out, matching the route handler's real default. */
export const authHandlers = [
  http.get("/api/auth/session", () => HttpResponse.json(SIGNED_OUT)),
];

/** Convenience override for tests that need a signed-in session:
 * `server.use(...signedInSessionHandlers)`. */
export const signedInSessionHandlers = [
  http.get("/api/auth/session", () => HttpResponse.json(SIGNED_IN)),
];

// ---------------------------------------------------------------------------
// On-chain read layer mock data (mirrors @/lib/qlx data)
// ---------------------------------------------------------------------------

interface Invoice {
  id: string;
  supplier: string;
  amountStroops: string; // bigint serialised as string over JSON
  status: string;
  dueAt: string;
}

interface InvoiceDetail {
  id: string;
  riskScore: number;
  fundedAmountStroops: string;
}

interface Transaction {
  id: string;
  invoiceId: string;
  kind: string;
  amountStroops: string;
  occurredAt: string;
}

const MOCK_INVOICES: Invoice[] = [
  { id: "inv_1001", supplier: "Acme Textiles", amountStroops: "125000000000000", status: "open", dueAt: "2026-08-15" },
  { id: "inv_1002", supplier: "Blue Ridge Foods", amountStroops: "42500000000000", status: "funded", dueAt: "2026-08-02" },
  { id: "inv_1003", supplier: "Cedar Point Logistics", amountStroops: "18750000000000", status: "open", dueAt: "2026-08-20" },
  { id: "inv_1004", supplier: "Delta Grain Co", amountStroops: "9000000000000", status: "repaid", dueAt: "2026-07-10" },
];

const MOCK_DETAILS: Record<string, InvoiceDetail> = {
  inv_1001: { id: "inv_1001", riskScore: 18, fundedAmountStroops: "0" },
  inv_1002: { id: "inv_1002", riskScore: 42, fundedAmountStroops: "42500000000000" },
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "txn_1", invoiceId: "inv_1002", kind: "funding", amountStroops: "42500000000000", occurredAt: "2026-07-20T10:00:00.000Z" },
  { id: "txn_2", invoiceId: "inv_1002", kind: "repayment", amountStroops: "5000000000000", occurredAt: "2026-07-25T10:00:00.000Z" },
];

/** Handlers for the on-chain read layer API routes. Every qlx client function
 * that fetches invoice/portfolio data goes through these endpoints, which are
 * intercepted by MSW during tests so handlers can be overridden per test. */
export const onChainReadHandlers = [
  // GET /api/invoices?userId=<id>
  http.get("/api/invoices", ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return new HttpResponse(null, { status: 400 });
    }
    return HttpResponse.json({ invoices: MOCK_INVOICES });
  }),

  // POST /api/invoices/details  body: { ids: string[] }
  http.post("/api/invoices/details", async ({ request }) => {
    const body = (await request.json()) as { ids?: string[] };
    const ids = body.ids ?? [];
    const details = ids.map((id) => MOCK_DETAILS[id] ?? { id, riskScore: 50, fundedAmountStroops: "0" });
    return HttpResponse.json({ details });
  }),

  // GET /api/invoices/transactions?invoiceId=<id>
  http.get("/api/invoices/transactions", ({ request }) => {
    const url = new URL(request.url);
    const invoiceId = url.searchParams.get("invoiceId");
    const filtered = invoiceId ? MOCK_TRANSACTIONS.filter((txn) => txn.invoiceId === invoiceId) : [];
    return HttpResponse.json({ transactions: filtered });
  }),
];

/** Default handler for the on-chain transactions read layer. */
export const transactionsHandlers = [
  http.get("/api/transactions", () =>
    HttpResponse.json({
      transactions: MOCK_TRANSACTIONS.map((txn) => ({
        ...txn,
        amountStroops: txn.amountStroops.toString(),
      })),
    })
  ),
];

/** Convenience override for tests that need an empty transactions response. */
export const emptyTransactionsHandlers = [
  http.get("/api/transactions", () => HttpResponse.json({ transactions: [] })),
];

export const handlers = [...authHandlers, ...onChainReadHandlers, ...transactionsHandlers];

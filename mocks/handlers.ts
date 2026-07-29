import { http, HttpResponse } from "msw";
import type { SessionResponse } from "@/lib/auth";
import { MOCK_TRANSACTIONS } from "@/lib/transactions";

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

/** Default handler for the on-chain transactions read layer
 * (`/api/transactions`, backing `getTransactions()` in
 * `lib/generated/transactionsClient.ts`). `amountStroops` is wire-encoded
 * as a string here, matching the real route handler -- JSON has no bigint. */
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

/** Convenience override for tests that need an empty transactions response:
 * `server.use(...emptyTransactionsHandlers)`. */
export const emptyTransactionsHandlers = [
  http.get("/api/transactions", () => HttpResponse.json({ transactions: [] })),
];

export const handlers = [...authHandlers, ...transactionsHandlers];

import { describe, it, expect } from "vitest";
import { server } from "./server";
import { emptyTransactionsHandlers } from "./handlers";

describe("transactionsHandlers (on-chain read layer)", () => {
  it("serves the default mock transactions with amountStroops wire-encoded as a string", async () => {
    const res = await fetch("/api/transactions");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { transactions: Array<{ amountStroops: string }> };
    expect(body.transactions.length).toBeGreaterThan(0);
    expect(typeof body.transactions[0].amountStroops).toBe("string");
  });

  it("can be overridden per-test with emptyTransactionsHandlers", async () => {
    server.use(...emptyTransactionsHandlers);
    const res = await fetch("/api/transactions");
    const body = (await res.json()) as { transactions: unknown[] };
    expect(body.transactions).toEqual([]);
  });
});

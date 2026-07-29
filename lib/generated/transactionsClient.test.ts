import { describe, it, expect, vi, afterEach } from "vitest";
import { getTransactions } from "./transactionsClient";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getTransactions", () => {
  it("converts each transaction's amountStroops from the wire string to a bigint", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              transactions: [
                {
                  id: "txn_1",
                  invoiceId: "inv_1001",
                  type: "fund",
                  amountStroops: "500000000000",
                  createdAt: "2026-07-20T10:00:00.000Z",
                },
              ],
            }),
            { status: 200 }
          )
      )
    );

    const transactions = await getTransactions();

    expect(transactions).toEqual([
      {
        id: "txn_1",
        invoiceId: "inv_1001",
        type: "fund",
        amountStroops: 500_000_000_000n,
        createdAt: "2026-07-20T10:00:00.000Z",
      },
    ]);
  });

  it("throws with the status code when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("boom", { status: 500 }))
    );

    await expect(getTransactions()).rejects.toThrow("transactions request failed with status 500");
  });
});

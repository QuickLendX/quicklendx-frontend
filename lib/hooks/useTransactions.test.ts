import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useTransactions } from "./useTransactions";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useTransactions", () => {
  it("loads transactions through the generated client on success", async () => {
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
                  amountStroops: "1000000",
                  createdAt: "2026-07-20T10:00:00.000Z",
                },
              ],
            }),
            { status: 200 }
          )
      )
    );

    const { result } = renderHook(() => useTransactions());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.transactions).toEqual([
      {
        id: "txn_1",
        invoiceId: "inv_1001",
        type: "fund",
        amountStroops: 1_000_000n,
        createdAt: "2026-07-20T10:00:00.000Z",
      },
    ]);
    expect(result.current.error).toBeNull();
  });

  it("surfaces an error and an empty list when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("boom", { status: 500 }))
    );

    const { result } = renderHook(() => useTransactions());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.transactions).toEqual([]);
    expect(result.current.error).toBe("transactions request failed with status 500");
  });
});

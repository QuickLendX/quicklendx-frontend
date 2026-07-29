import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useTransactions } from "./useTransactions";

const wireTransaction = {
  id: "txn_1",
  invoiceId: "inv_1002",
  kind: "funding",
  amountStroops: "425000000000",
  occurredAt: "2026-07-20T10:00:00.000Z",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useTransactions", () => {
  it("loads transactions and parses amountStroops as a bigint", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ transactions: [wireTransaction] }), { status: 200 }))
    );

    const { result } = renderHook(() => useTransactions("inv_1002"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.transactions).toEqual([
      { ...wireTransaction, amountStroops: 425_000_000_000n },
    ]);
    expect(result.current.error).toBeNull();
  });

  it("surfaces an error and an empty list when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("boom", { status: 500 }))
    );

    const { result } = renderHook(() => useTransactions("inv_1002"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.transactions).toEqual([]);
    expect(result.current.error).toBe("transactions request failed with status 500");
  });
});

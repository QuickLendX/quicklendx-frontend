import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useInvoiceList } from "./useInvoiceList";

describe("useInvoiceList", () => {
  it("loads the first page for a user with invoices", async () => {
    const { result } = renderHook(() => useInvoiceList("demo-user", 2));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.invoices).toHaveLength(2);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("appends the next page instead of replacing the list", async () => {
    const { result } = renderHook(() => useInvoiceList("demo-user", 2));
    await waitFor(() => expect(result.current.loading).toBe(false));
    const firstPageIds = result.current.invoices.map((invoice) => invoice.id);

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const allIds = result.current.invoices.map((invoice) => invoice.id);
    expect(allIds.slice(0, firstPageIds.length)).toEqual(firstPageIds);
    expect(allIds.length).toBeGreaterThan(firstPageIds.length);
  });

  it("resolves with an empty, non-loading list for a user with no invoices", async () => {
    const { result } = renderHook(() => useInvoiceList("", 2));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.invoices).toEqual([]);
    expect(result.current.hasMore).toBe(false);
  });
});

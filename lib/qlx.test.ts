import { describe, it, expect } from "vitest";
import { getInvoiceDetail, getInvoiceDetailsBatch, getInvoicePage } from "./qlx";

const IDS = ["inv_a", "inv_b", "inv_c", "inv_d", "inv_e"];

describe("getInvoicePage", () => {
  it("returns the first page with a cursor for the next one", async () => {
    const page = await getInvoicePage("demo-user", { limit: 2 });

    expect(page.invoices).toHaveLength(2);
    expect(page.nextCursor).toBe(page.invoices[1].id);
  });

  it("walks every invoice exactly once across pages", async () => {
    const seen: string[] = [];
    let cursor: string | null = null;

    do {
      const page: Awaited<ReturnType<typeof getInvoicePage>> = await getInvoicePage(
        "demo-user",
        { cursor, limit: 2 }
      );
      seen.push(...page.invoices.map((invoice) => invoice.id));
      cursor = page.nextCursor;
    } while (cursor !== null);

    expect(new Set(seen).size).toBe(seen.length);
    expect(seen.length).toBeGreaterThan(2);
  });

  it("returns a null cursor once the last page is reached", async () => {
    const page = await getInvoicePage("demo-user", { limit: 100 });

    expect(page.nextCursor).toBeNull();
  });
});

describe("getInvoiceDetailsBatch", () => {
  it("returns a detail for every requested id", async () => {
    const result = await getInvoiceDetailsBatch(IDS);

    expect(result.size).toBe(IDS.length);
    for (const id of IDS) {
      expect(result.get(id)?.id).toBe(id);
    }
  });

  it("resolves immediately for an empty id list, with no simulated round trip", async () => {
    const start = performance.now();
    const result = await getInvoiceDetailsBatch([]);
    const elapsed = performance.now() - start;

    expect(result.size).toBe(0);
    expect(elapsed).toBeLessThan(10);
  });

  it("costs roughly one round trip regardless of portfolio size, unlike one lookup per id (#90)", async () => {
    const batchStart = performance.now();
    await getInvoiceDetailsBatch(IDS);
    const batchElapsed = performance.now() - batchStart;

    const sequentialStart = performance.now();
    for (const id of IDS) {
      await getInvoiceDetail(id);
    }
    const sequentialElapsed = performance.now() - sequentialStart;

    // The batched call should stay close to a single round trip, while the
    // sequential loop pays one round trip per id -- with 5 ids that's a
    // comfortable, non-flaky margin to assert on.
    expect(batchElapsed).toBeLessThan(sequentialElapsed / 2);
  });
});

describe("getTransactionsForInvoice", () => {
  it("returns only transactions for the given invoice", async () => {
    const transactions = await getTransactionsForInvoice("inv_1002");
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions.every((txn) => txn.invoiceId === "inv_1002")).toBe(true);
  });

  it("resolves to an empty list for an invoice with no transactions", async () => {
    expect(await getTransactionsForInvoice("inv_does_not_exist")).toEqual([]);
  });

  it("resolves to an empty list for an empty invoiceId", async () => {
    expect(await getTransactionsForInvoice("")).toEqual([]);
  });
});

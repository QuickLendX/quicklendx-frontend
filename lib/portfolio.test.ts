import { describe, it, expect } from "vitest";
import { sortRowsByRisk } from "./portfolio";
import type { PortfolioRow } from "@/app/(app)/portfolio/PortfolioView";
import type { Invoice, InvoiceDetail } from "@/lib/qlx";

function row(id: string, riskScore: number): PortfolioRow {
  const invoice: Invoice = {
    id,
    supplier: "Acme Textiles",
    amountStroops: 1n,
    status: "funded",
    dueAt: "2026-08-01",
  };
  const detail: InvoiceDetail = { id, riskScore, fundedAmountStroops: 1n };
  return { invoice, detail };
}

describe("sortRowsByRisk", () => {
  it("orders rows highest-risk-first", () => {
    const rows = [row("inv_low", 10), row("inv_high", 90), row("inv_mid", 50)];

    expect(sortRowsByRisk(rows).map((r) => r.invoice.id)).toEqual([
      "inv_high",
      "inv_mid",
      "inv_low",
    ]);
  });

  it("breaks ties on invoice id for a stable order", () => {
    const rows = [row("inv_b", 50), row("inv_a", 50)];

    expect(sortRowsByRisk(rows).map((r) => r.invoice.id)).toEqual(["inv_a", "inv_b"]);
  });

  it("does not mutate the input array", () => {
    const rows = [row("inv_low", 10), row("inv_high", 90)];
    const original = [...rows];

    sortRowsByRisk(rows);

    expect(rows).toEqual(original);
  });
});

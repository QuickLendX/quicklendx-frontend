import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PortfolioView, type PortfolioRow } from "./PortfolioView";
import type { Invoice, InvoiceDetail } from "@/lib/qlx";

const invoice: Invoice = {
  id: "inv_1",
  supplier: "Acme Textiles",
  amountStroops: 10_0000000n,
  status: "funded",
  dueAt: "2026-08-01",
};

const detail: InvoiceDetail = {
  id: "inv_1",
  riskScore: 18,
  fundedAmountStroops: 5_0000000n,
};

describe("PortfolioView", () => {
  it("renders an empty state when the portfolio has no rows", () => {
    render(<PortfolioView rows={[]} />);

    expect(screen.getByRole("status")).toHaveTextContent("Your portfolio is empty");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders one row per invoice with its risk score and funded amount", () => {
    const rows: PortfolioRow[] = [{ invoice, detail }];
    render(<PortfolioView rows={rows} />);

    expect(screen.getByRole("list", { name: "Portfolio" })).toBeInTheDocument();
    expect(screen.getByText("Acme Textiles")).toBeInTheDocument();
    expect(screen.getByText("Risk 18")).toBeInTheDocument();
    expect(screen.getByText("5.0000000 XLM funded")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PortfolioView, type PortfolioRow } from "./PortfolioView";
import * as portfolioLib from "@/lib/portfolio";
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

  it("shows the highest-risk row first", () => {
    const lowRisk: PortfolioRow = {
      invoice: { ...invoice, id: "inv_low", supplier: "Low Risk Co" },
      detail: { ...detail, id: "inv_low", riskScore: 5 },
    };
    const highRisk: PortfolioRow = {
      invoice: { ...invoice, id: "inv_high", supplier: "High Risk Co" },
      detail: { ...detail, id: "inv_high", riskScore: 95 },
    };
    render(<PortfolioView rows={[lowRisk, highRisk]} />);

    const suppliers = screen.getAllByText(/Risk Co$/).map((el) => el.textContent);
    expect(suppliers).toEqual(["High Risk Co", "Low Risk Co"]);
  });

  it("does not re-run the sort when the rows array reference is unchanged", () => {
    const sortSpy = vi.spyOn(portfolioLib, "sortRowsByRisk");
    const rows: PortfolioRow[] = [{ invoice, detail }];

    const { rerender } = render(<PortfolioView rows={rows} />);
    rerender(<PortfolioView rows={rows} />);

    expect(sortSpy).toHaveBeenCalledTimes(1);
    sortSpy.mockRestore();
  });
});

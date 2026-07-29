import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DashboardView } from "./DashboardView";
import type { Invoice } from "@/lib/qlx";

const invoice: Invoice = {
  id: "inv_1",
  supplier: "Acme Textiles",
  amountStroops: 10_0000000n,
  status: "open",
  dueAt: "2026-08-01",
};

describe("DashboardView", () => {
  it("renders an empty state when there are no invoices", () => {
    render(<DashboardView invoices={[]} />);

    expect(screen.getByRole("status")).toHaveTextContent("No invoices yet");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders the invoice list when invoices are present", () => {
    render(<DashboardView invoices={[invoice]} />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Invoices" })).toBeInTheDocument();
    expect(screen.getByText("Acme Textiles")).toBeInTheDocument();
    expect(screen.getByText("10.0000000 XLM")).toBeInTheDocument();
    expect(screen.getByText("open")).toBeInTheDocument();
  });

  it("renders one list item per invoice", () => {
    const invoices: Invoice[] = [
      invoice,
      { ...invoice, id: "inv_2", supplier: "Blue Ridge Foods" },
    ];
    render(<DashboardView invoices={invoices} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});

import { useMemo } from "react";
import { EmptyState } from "@/components/EmptyState";
import { formatStroops } from "@/lib/money";
import { sortRowsByRisk } from "@/lib/portfolio";
import type { Invoice, InvoiceDetail } from "@/lib/qlx";

export interface PortfolioRow {
  invoice: Invoice;
  detail: InvoiceDetail;
}

export interface PortfolioViewProps {
  rows: PortfolioRow[];
}

/** Pure presentational portfolio body: a risk-annotated invoice list, or an
 * explicit empty state when the user's portfolio is empty. Rows are shown
 * highest-risk-first so the riskiest positions are never scrolled past. */
export function PortfolioView({ rows }: PortfolioViewProps) {
  // `sortRowsByRisk` walks every row, so it's only worth re-running when
  // `rows` itself changes -- not on every re-render of this component (e.g.
  // from unrelated sidebar/toast state changing elsewhere in the tree).
  const sortedRows = useMemo(() => sortRowsByRisk(rows), [rows]);

  if (sortedRows.length === 0) {
    return (
      <EmptyState
        title="Your portfolio is empty"
        description="Fund an invoice to start building your portfolio."
      />
    );
  }

  return (
    <ul aria-label="Portfolio" className="portfolio-list">
      {sortedRows.map(({ invoice, detail }) => (
        <li key={invoice.id}>
          <span className="invoice-supplier">{invoice.supplier}</span>
          <span className="invoice-risk">Risk {detail.riskScore}</span>
          <span className="invoice-funded">
            {formatStroops(detail.fundedAmountStroops)} XLM funded
          </span>
        </li>
      ))}
    </ul>
  );
}

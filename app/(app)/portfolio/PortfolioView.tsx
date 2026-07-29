import { EmptyState } from "@/components/EmptyState";
import { formatStroops } from "@/lib/money";
import type { Invoice, InvoiceDetail } from "@/lib/qlx";

export interface PortfolioRow {
  invoice: Invoice;
  detail: InvoiceDetail;
}

export interface PortfolioViewProps {
  rows: PortfolioRow[];
}

/** Pure presentational portfolio body: a risk-annotated invoice list, or an
 * explicit empty state when the user's portfolio is empty. */
export function PortfolioView({ rows }: PortfolioViewProps) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title="Your portfolio is empty"
        description="Fund an invoice to start building your portfolio."
      />
    );
  }

  return (
    <ul aria-label="Portfolio" className="portfolio-list">
      {rows.map(({ invoice, detail }) => (
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

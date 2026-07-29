import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { formatStroops } from "@/lib/money";
import type { Invoice } from "@/lib/qlx";

export interface DashboardViewProps {
  invoices: Invoice[];
}

/** Pure presentational dashboard body: an invoice list, or an explicit
 * empty state when the user has none. Kept separate from `page.tsx` (the
 * async data-fetching Server Component) so it can be unit-tested directly
 * without needing to render a Server Component in tests. */
export function DashboardView({ invoices }: DashboardViewProps) {
  if (invoices.length === 0) {
    return (
      <EmptyState
        title="No invoices yet"
        description="Invoices you post or fund will show up here."
      />
    );
  }

  return (
    <ul aria-label="Invoices" className="invoice-list">
      {invoices.map((invoice) => (
        <li key={invoice.id}>
          <Link href={`/dashboard/${invoice.id}`}>
            <span className="invoice-supplier">{invoice.supplier}</span>
            <span className="invoice-amount">{formatStroops(invoice.amountStroops)} XLM</span>
            <span className="invoice-status">{invoice.status}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

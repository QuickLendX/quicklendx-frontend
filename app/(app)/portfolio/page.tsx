import { Sidebar } from "@/components/Sidebar";
import { getInvoiceDetailsBatch, getInvoicesForUser } from "@/lib/qlx";
import { PortfolioView, type PortfolioRow } from "./PortfolioView";

// TODO: replace with the signed-in user's id once session auth lands (#97).
const DEMO_USER_ID = "demo-user";

export default async function PortfolioPage() {
  const invoices = await getInvoicesForUser(DEMO_USER_ID);
  const details = await getInvoiceDetailsBatch(invoices.map((invoice) => invoice.id));

  const rows: PortfolioRow[] = invoices.map((invoice) => ({
    invoice,
    detail: details.get(invoice.id) ?? { id: invoice.id, riskScore: 50, fundedAmountStroops: 0n },
  }));

  return (
    <div className="app-shell">
      <Sidebar />
      <main>
        <h1>Portfolio</h1>
        <PortfolioView rows={rows} />
      </main>
    </div>
  );
}

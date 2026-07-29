import { Sidebar } from "@/components/Sidebar";
import { getInvoicesForUser } from "@/lib/qlx";
import { DashboardView } from "./DashboardView";

// TODO: replace with the signed-in user's id once session auth lands (#97).
const DEMO_USER_ID = "demo-user";

export default async function DashboardPage() {
  const invoices = await getInvoicesForUser(DEMO_USER_ID);

  return (
    <div className="app-shell">
      <Sidebar />
      <main>
        <h1>Dashboard</h1>
        <DashboardView invoices={invoices} />
      </main>
    </div>
  );
}

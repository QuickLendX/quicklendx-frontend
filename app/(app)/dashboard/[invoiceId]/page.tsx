import { getInvoiceDetail } from "@/lib/qlx";
import { formatStroops } from "@/lib/money";
import { InvoiceFundStep } from "@/components/InvoiceFundStep";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  const detail = await getInvoiceDetail(invoiceId);

  return (
    <>
      <h1>Invoice {invoiceId}</h1>
      <p>Risk score: {detail.riskScore}</p>
      <p>Funded so far: {formatStroops(detail.fundedAmountStroops)} XLM</p>
      <InvoiceFundStep invoiceId={invoiceId} />
    </>
  );
}

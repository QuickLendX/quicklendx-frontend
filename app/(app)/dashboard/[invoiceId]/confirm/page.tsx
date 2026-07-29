import Link from "next/link";

export default async function InvoiceFundConfirmPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;

  return (
    <>
      <h1>Confirm funding</h1>
      <p>Review invoice {invoiceId} before funding.</p>
      <Link href={`/dashboard/${invoiceId}`}>Back to invoice</Link>
    </>
  );
}

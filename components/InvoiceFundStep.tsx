"use client";

import { useRouter } from "next/navigation";

export interface InvoiceFundStepProps {
  invoiceId: string;
}

/** Advances from the invoice-detail step to the funding-confirmation step.
 * Uses `router.push` (not `router.replace`) so the detail step stays in
 * the browser history stack -- pressing back from the confirm step must
 * return to this step, not skip past it straight to the invoice list (#133). */
export function InvoiceFundStep({ invoiceId }: InvoiceFundStepProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={() => router.push(`/dashboard/${invoiceId}/confirm`)}
    >
      Continue to confirm
    </button>
  );
}

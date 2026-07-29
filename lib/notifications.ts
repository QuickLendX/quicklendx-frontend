/** Shared shape between the `/api/notifications` route handler and the
 * client hook that consumes it -- this type is the contract until a formal
 * OpenAPI schema exists. `id` is an opaque string, not a database row
 * number, so it's safe to expose as a stable public field. */
export interface Notification {
  id: string;
  title: string;
  read: boolean;
  createdAt: string;
}

export const MOCK_NOTIFICATIONS: readonly Notification[] = [
  {
    id: "notif_invoice_funded",
    title: "Invoice inv_1002 is fully funded.",
    read: false,
    createdAt: "2026-07-27T14:30:00.000Z",
  },
  {
    id: "notif_kyc_reminder",
    title: "Complete your KYC verification to raise your funding limit.",
    read: true,
    createdAt: "2026-07-20T09:00:00.000Z",
  },
];

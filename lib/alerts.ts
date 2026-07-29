/** Shared shape between the `/api/alerts` route handler and the client
 * hook that consumes it -- this type is the contract until a formal
 * OpenAPI schema exists. `id` is an opaque string, not a database row
 * number, so it's safe to expose as a stable public field. */
export interface Alert {
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
  createdAt: string;
}

export const MOCK_ALERTS: readonly Alert[] = [
  {
    id: "alert_low_risk_score",
    severity: "warning",
    message: "Invoice inv_1001 dropped below the risk-score threshold.",
    createdAt: "2026-07-28T09:00:00.000Z",
  },
  {
    id: "alert_funding_complete",
    severity: "info",
    message: "Invoice inv_1002 is fully funded.",
    createdAt: "2026-07-27T14:30:00.000Z",
  },
];

/** Shared shape between the `/api/health/deep` route handler and the
 * client hook that consumes it -- this type is the contract until a formal
 * OpenAPI schema exists. Additive-only: new checks are safe for existing
 * consumers, since none of them destructure beyond `status`/`checks`. */
export type HealthStatus = "ok" | "degraded" | "down";

export interface HealthCheck {
  name: string;
  ok: boolean;
}

export interface HealthDeep {
  status: HealthStatus;
  checks: HealthCheck[];
  checkedAt: string;
}

/**
 * Generates a client-side request id to attach to outgoing fetches (as the
 * `X-Request-Id` header). Correlating a failed fetch's client-side log
 * entry with the server-side access log for the same attempt only works if
 * every request carries one, so this is the single place that generates
 * them.
 *
 * Falls back to a timestamp+random string when `crypto.randomUUID` isn't
 * available (older browsers, some test environments) rather than throwing --
 * a less-random id is still far better than no id at all for correlation.
 */
export function newRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

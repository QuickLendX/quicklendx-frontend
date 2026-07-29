import config from "@/lib/config";
import { log } from "@/lib/logger";

export interface CaptureResult {
  /** `true` when the error was routed to the error-tracking sink, `false`
   * when it was dropped because Sentry is disabled (no DSN configured). */
  sent: boolean;
  tag: string;
}

/**
 * Captures a client-side error under `tag` (a short, scoped label such as
 * `"payout-form"` or `"invoice-fetch"` -- not a free-form message) so
 * errors from different UI areas can be filtered independently once they
 * land in Sentry.
 *
 * The `@sentry/nextjs` SDK isn't wired into this app yet, so this emits a
 * structured log entry as the transport -- swapping in a real
 * `Sentry.captureException` call later is a one-line change inside this
 * function, and every call site (and its tests) is unaffected.
 *
 * No-ops (but still logs a `warn`, so a genuine failure isn't silent) when
 * `SENTRY_DSN` is unset, matching `config.sentryDsn`'s existing
 * disabled-when-empty convention.
 */
export function captureClientError(error: Error, tag: string): CaptureResult {
  if (!config.sentryDsn) {
    log("warn", "client_error_dropped", { tag, message: error.message, reason: "sentry_disabled" });
    return { sent: false, tag };
  }

  log("error", "client_error_captured", { tag, message: error.message });
  return { sent: true, tag };
}

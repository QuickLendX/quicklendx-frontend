"use client";

import { useEffect, useState } from "react";
import type { Alert } from "@/lib/alerts";
import { log } from "@/lib/logger";
import { newRequestId } from "@/lib/requestId";

export interface UseAlertsResult {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
}

/** Fetches `/api/alerts` and exposes it as typed state. Additive-only over
 * time: new fields on `Alert` are safe for existing consumers, since none
 * of them destructure beyond what they use.
 *
 * Every request carries a client-generated request id (sent as the
 * `X-Request-Id` header) so a failed fetch can be logged with a value that
 * correlates the client-side error entry with the server-side access log
 * for the same attempt. */
export function useAlerts(): UseAlertsResult {
  const [result, setResult] = useState<UseAlertsResult>({
    alerts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const requestId = newRequestId();

    fetch("/api/alerts", { headers: { "X-Request-Id": requestId } })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`alerts request failed with status ${res.status}`);
        }
        const body = (await res.json()) as { alerts: Alert[] };
        if (!cancelled) {
          setResult({ alerts: body.alerts, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "failed to load alerts";
        log("error", "alerts_fetch_failed", { requestId, message });
        if (!cancelled) {
          setResult({ alerts: [], loading: false, error: message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return result;
}

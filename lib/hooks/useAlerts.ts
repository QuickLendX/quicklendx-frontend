"use client";

import { useEffect, useState } from "react";
import type { Alert } from "@/lib/alerts";

export interface UseAlertsResult {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
}

/** Fetches `/api/alerts` and exposes it as typed state. Additive-only over
 * time: new fields on `Alert` are safe for existing consumers, since none
 * of them destructure beyond what they use. */
export function useAlerts(): UseAlertsResult {
  const [result, setResult] = useState<UseAlertsResult>({
    alerts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/alerts")
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
        if (!cancelled) {
          setResult({
            alerts: [],
            loading: false,
            error: err instanceof Error ? err.message : "failed to load alerts",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return result;
}

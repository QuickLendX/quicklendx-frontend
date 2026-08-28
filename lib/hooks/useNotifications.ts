"use client";

import { useEffect, useState } from "react";
import type { Notification } from "@/lib/notifications";
import { log } from "@/lib/logger";
import { newRequestId } from "@/lib/requestId";

export interface UseNotificationsResult {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

/** Fetches `/api/notifications` and exposes it as typed state. Additive-only
 * over time: new fields on `Notification` are safe for existing consumers,
 * since none of them destructure beyond what they use.
 *
 * Every request carries a client-generated request id (sent as the
 * `X-Request-Id` header) so a failed fetch can be logged with a value that
 * correlates the client-side error entry with the server-side access log
 * for the same attempt. */
export function useNotifications(): UseNotificationsResult {
  const [result, setResult] = useState<UseNotificationsResult>({
    notifications: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const requestId = newRequestId();

    fetch("/api/notifications", { headers: { "X-Request-Id": requestId } })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`notifications request failed with status ${res.status}`);
        }
        const body = (await res.json()) as { notifications: Notification[] };
        if (!cancelled) {
          setResult({ notifications: body.notifications, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "failed to load notifications";
        log("error", "notifications_fetch_failed", { requestId, message });
        if (!cancelled) {
          setResult({ notifications: [], loading: false, error: message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return result;
}

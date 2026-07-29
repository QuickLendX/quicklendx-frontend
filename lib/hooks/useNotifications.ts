"use client";

import { useEffect, useState } from "react";
import type { Notification } from "@/lib/notifications";

export interface UseNotificationsResult {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

/** Fetches `/api/notifications` and exposes it as typed state. Additive-only
 * over time: new fields on `Notification` are safe for existing consumers,
 * since none of them destructure beyond what they use. */
export function useNotifications(): UseNotificationsResult {
  const [result, setResult] = useState<UseNotificationsResult>({
    notifications: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/notifications")
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
        if (!cancelled) {
          setResult({
            notifications: [],
            loading: false,
            error: err instanceof Error ? err.message : "failed to load notifications",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return result;
}

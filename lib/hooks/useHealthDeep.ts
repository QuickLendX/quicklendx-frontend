"use client";

import { useCallback, useEffect, useState } from "react";
import type { HealthDeep } from "@/lib/health";

export interface UseHealthDeepResult {
  health: HealthDeep | null;
  loading: boolean;
  error: string | null;
  /** Re-runs the fetch on demand, e.g. after the caller resolves whatever
   * made a dependency unhealthy, without needing a full page reload. */
  refetch: () => void;
}

/** Fetches `/api/health/deep` and exposes it as typed state. */
export function useHealthDeep(): UseHealthDeepResult {
  const [state, setState] = useState<Omit<UseHealthDeepResult, "refetch">>({
    health: null,
    loading: true,
    error: null,
  });
  const [attempt, setAttempt] = useState(0);

  const refetch = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setState((current) => ({ ...current, loading: true, error: null }));

    fetch("/api/health/deep")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`health/deep request failed with status ${res.status}`);
        }
        const health = (await res.json()) as HealthDeep;
        if (!cancelled) {
          setState({ health, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            health: null,
            loading: false,
            error: err instanceof Error ? err.message : "failed to load health/deep",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  return { ...state, refetch };
}

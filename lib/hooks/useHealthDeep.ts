"use client";

import { useEffect, useState } from "react";
import type { HealthDeep } from "@/lib/health";

export interface UseHealthDeepResult {
  health: HealthDeep | null;
  loading: boolean;
  error: string | null;
}

/** Fetches `/api/health/deep` and exposes it as typed state. */
export function useHealthDeep(): UseHealthDeepResult {
  const [result, setResult] = useState<UseHealthDeepResult>({
    health: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/health/deep")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`health/deep request failed with status ${res.status}`);
        }
        const health = (await res.json()) as HealthDeep;
        if (!cancelled) {
          setResult({ health, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setResult({
            health: null,
            loading: false,
            error: err instanceof Error ? err.message : "failed to load health/deep",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return result;
}

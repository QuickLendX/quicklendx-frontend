"use client";

import { useEffect, useState } from "react";
import type { SessionResponse, SessionUser } from "@/lib/auth";

export interface UseSessionResult {
  user: SessionUser | null;
  loading: boolean;
  error: string | null;
}

/** Fetches `/api/auth/session` and exposes it as typed state. */
export function useSession(): UseSessionResult {
  const [result, setResult] = useState<UseSessionResult>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/session")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`session request failed with status ${res.status}`);
        }
        const body = (await res.json()) as SessionResponse;
        if (!cancelled) {
          setResult({ user: body.user, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setResult({
            user: null,
            loading: false,
            error: err instanceof Error ? err.message : "failed to load session",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return result;
}

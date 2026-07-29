"use client";

import { useEffect, useState } from "react";
import type { SessionResponse, SessionUser } from "@/lib/auth";
import { fetchJson } from "@/lib/api";

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

    fetchJson<SessionResponse>("/api/auth/session", "session")
      .then((body) => {
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

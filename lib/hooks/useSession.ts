"use client";

import { useEffect, useState } from "react";
import type { SessionResponse, SessionUser } from "@/lib/auth";

export interface UseSessionResult {
  user: SessionUser | null;
  loading: boolean;
  error: string | null;
}

const IDLE: UseSessionResult = { user: null, loading: true, error: null };

// Cached across mounts for the lifetime of the page. Every route under the
// `(app)` layout remounts components that call `useSession`, so without
// this a route change would re-pay the loading -> loaded render pass even
// though the session hasn't changed. A transient failure is deliberately
// not cached, so the next mount gets a fresh attempt instead of sticking.
let cached: UseSessionResult | null = null;

export function useSession(): UseSessionResult {
  const [result, setResult] = useState<UseSessionResult>(() => cached ?? IDLE);

  useEffect(() => {
    if (cached) return;
    let cancelled = false;

    fetch("/api/auth/session")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`session request failed with status ${res.status}`);
        }
        const body = (await res.json()) as SessionResponse;
        const next: UseSessionResult = { user: body.user, loading: false, error: null };
        cached = next;
        if (!cancelled) setResult(next);
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

/** Test-only: clears the module-level cache so each test starts from a
 * clean slate instead of leaking a previous test's resolved session. */
export function __resetSessionCacheForTests(): void {
  cached = null;
}

/**
 * Wipes locally-held session and form state on logout. A shared/kiosk
 * device signing out must not leave a later user able to read a prior
 * session's cached data or an in-progress form draft, so this clears the
 * in-memory session cache *and* every `sessionStorage`/`localStorage` key
 * -- not just the ones this module knows about -- rather than trying to
 * enumerate every form that might have persisted a draft.
 */
export function logout(): void {
  cached = null;
  if (typeof window !== "undefined") {
    window.sessionStorage.clear();
    window.localStorage.clear();
  }
}

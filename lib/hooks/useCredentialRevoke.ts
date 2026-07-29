"use client";

import { useCallback, useState } from "react";

export interface UseCredentialRevokeResult {
  revoke: (credentialId: string) => Promise<boolean>;
  revoking: boolean;
  error: string | null;
}

/** Exposes `POST /api/credentials/revoke` as a typed mutation. `revoke`
 * resolves to `true` on success and `false` on failure (never rejects), so
 * callers can `if (await revoke(id))` without a try/catch at every call
 * site; `error` still gets set for callers that want to render it. */
export function useCredentialRevoke(): UseCredentialRevokeResult {
  const [revoking, setRevoking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const revoke = useCallback(async (credentialId: string): Promise<boolean> => {
    setRevoking(true);
    setError(null);

    try {
      const res = await fetch("/api/credentials/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentialId }),
      });

      if (!res.ok) {
        throw new Error(`revoke request failed with status ${res.status}`);
      }

      setRevoking(false);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "failed to revoke credential");
      setRevoking(false);
      return false;
    }
  }, []);

  return { revoke, revoking, error };
}

"use client";

import { useSession } from "./useSession";

export interface UseTenantResult {
  /** The signed-in wallet's public key. This app is single-tenant-per-session
   * (no separate org/workspace concept) -- the tenant is the authenticated
   * identity itself. */
  tenantId: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

/** Resolves the current tenant from the auth session (`useSession`). */
export function useTenant(): UseTenantResult {
  const { user, loading, error } = useSession();

  return {
    tenantId: user?.publicKey ?? null,
    isAuthenticated: user !== null,
    loading,
    error,
  };
}

import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, it, expect, beforeEach } from "vitest";
import { useTenant } from "./useTenant";
import { __resetSessionCacheForTests } from "./useSession";
import { server } from "../../mocks/server";
import { signedInSessionHandlers } from "../../mocks/handlers";

describe("useTenant", () => {
  beforeEach(() => {
    __resetSessionCacheForTests();
  });

  it("resolves to an unauthenticated tenant by default (the MSW default handler)", async () => {
    const { result } = renderHook(() => useTenant());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.tenantId).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("resolves tenantId to the signed-in user's public key", async () => {
    server.use(...signedInSessionHandlers);

    const { result } = renderHook(() => useTenant());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.tenantId).toBe("GABCDEXAMPLESTELLARPUBLICKEY000000000000000000000000000");
  });

  it("surfaces a session error without treating it as authenticated", async () => {
    server.use(http.get("/api/auth/session", () => new HttpResponse("boom", { status: 500 })));

    const { result } = renderHook(() => useTenant());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.tenantId).toBeNull();
    expect(result.current.error).toBe("session request failed with status 500");
  });
});

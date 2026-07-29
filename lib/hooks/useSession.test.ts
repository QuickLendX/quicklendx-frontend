import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, it, expect, beforeEach } from "vitest";
import { useSession, __resetSessionCacheForTests, logout } from "./useSession";
import { server } from "../../mocks/server";
import { signedInSessionHandlers } from "../../mocks/handlers";

describe("useSession", () => {
  beforeEach(() => {
    __resetSessionCacheForTests();
  });

  it("resolves to a signed-out session by default (the MSW default handler)", async () => {
    const { result } = renderHook(() => useSession());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("resolves to the signed-in user when the handler is overridden", async () => {
    server.use(...signedInSessionHandlers);

    const { result } = renderHook(() => useSession());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual({
      publicKey: "GABCDEXAMPLESTELLARPUBLICKEY000000000000000000000000000",
    });
  });

  it("surfaces an error when the session endpoint fails", async () => {
    server.use(http.get("/api/auth/session", () => new HttpResponse("boom", { status: 500 })));

    const { result } = renderHook(() => useSession());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe("session request failed with status 500");
  });

  it("renders the settled result immediately on a second mount, with no loading flash (#128)", async () => {
    const first = renderHook(() => useSession());
    await waitFor(() => expect(first.result.current.loading).toBe(false));
    first.unmount();

    const second = renderHook(() => useSession());

    // No `waitFor` here: the second mount must already be settled on its
    // very first render, since the fetch it would otherwise trigger is
    // skipped in favor of the cached result from the first mount.
    expect(second.result.current.loading).toBe(false);
    expect(second.result.current.user).toBeNull();
  });

  it("logout wipes the cached session and all local/session storage", async () => {
    server.use(...signedInSessionHandlers);
    const first = renderHook(() => useSession());
    await waitFor(() => expect(first.result.current.loading).toBe(false));
    first.unmount();

    window.localStorage.setItem("draft-invoice-amount", "12.5");
    window.sessionStorage.setItem("wizard-step", "2");

    logout();

    expect(window.localStorage.getItem("draft-invoice-amount")).toBeNull();
    expect(window.sessionStorage.getItem("wizard-step")).toBeNull();

    // The next mount must re-fetch rather than reuse the wiped-out session.
    const second = renderHook(() => useSession());
    expect(second.result.current.loading).toBe(true);
  });
});

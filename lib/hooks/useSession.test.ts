import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, it, expect } from "vitest";
import { useSession } from "./useSession";
import { server } from "../../mocks/server";
import { signedInSessionHandlers } from "../../mocks/handlers";

describe("useSession", () => {
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
});

import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useCredentialRevoke } from "./useCredentialRevoke";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useCredentialRevoke", () => {
  it("resolves true and clears the error on a successful revoke", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ revoked: true }), { status: 200 }))
    );

    const { result } = renderHook(() => useCredentialRevoke());

    let outcome: boolean | undefined;
    await act(async () => {
      outcome = await result.current.revoke("cred_1");
    });

    expect(outcome).toBe(true);
    expect(result.current.error).toBeNull();
    await waitFor(() => expect(result.current.revoking).toBe(false));
  });

  it("resolves false and sets a typed error when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("boom", { status: 500 }))
    );

    const { result } = renderHook(() => useCredentialRevoke());

    let outcome: boolean | undefined;
    await act(async () => {
      outcome = await result.current.revoke("cred_1");
    });

    expect(outcome).toBe(false);
    expect(result.current.error).toBe("revoke request failed with status 500");
  });

  it("sends the credential id as the request body", async () => {
    const fetchSpy = vi.fn(
      async () => new Response(JSON.stringify({ revoked: true }), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchSpy);

    const { result } = renderHook(() => useCredentialRevoke());
    await act(async () => {
      await result.current.revoke("cred_42");
    });

    const call = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(call[1].body as string)).toEqual({ credentialId: "cred_42" });
  });
});

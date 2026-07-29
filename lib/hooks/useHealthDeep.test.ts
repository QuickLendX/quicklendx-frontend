import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useHealthDeep } from "./useHealthDeep";
import type { HealthDeep } from "@/lib/health";

const sampleHealth: HealthDeep = {
  status: "ok",
  checks: [{ name: "rpc", ok: true }],
  checkedAt: "2026-07-28T00:00:00.000Z",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useHealthDeep", () => {
  it("loads and returns health on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify(sampleHealth), { status: 200 }))
    );

    const { result } = renderHook(() => useHealthDeep());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.health).toEqual(sampleHealth);
    expect(result.current.error).toBeNull();
  });

  it("surfaces an error and a null health when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("boom", { status: 503 }))
    );

    const { result } = renderHook(() => useHealthDeep());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.health).toBeNull();
    expect(result.current.error).toBe("health/deep request failed with status 503");
  });
});

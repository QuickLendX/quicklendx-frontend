import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useAlerts } from "./useAlerts";
import type { Alert } from "@/lib/alerts";

const sampleAlert: Alert = {
  id: "alert_1",
  severity: "info",
  message: "hello",
  createdAt: "2026-07-28T00:00:00.000Z",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useAlerts", () => {
  it("loads and returns alerts on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ alerts: [sampleAlert] }), { status: 200 }))
    );

    const { result } = renderHook(() => useAlerts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.alerts).toEqual([sampleAlert]);
    expect(result.current.error).toBeNull();
  });

  it("surfaces an error and an empty list when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("boom", { status: 500 }))
    );

    const { result } = renderHook(() => useAlerts());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.alerts).toEqual([]);
    expect(result.current.error).toBe("alerts request failed with status 500");
  });
});

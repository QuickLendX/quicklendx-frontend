import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useNotifications } from "./useNotifications";
import type { Notification } from "@/lib/notifications";

const sampleNotification: Notification = {
  id: "notif_1",
  title: "hello",
  read: false,
  createdAt: "2026-07-28T00:00:00.000Z",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useNotifications", () => {
  it("loads and returns notifications on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ notifications: [sampleNotification] }), { status: 200 })
      )
    );

    const { result } = renderHook(() => useNotifications());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.notifications).toEqual([sampleNotification]);
    expect(result.current.error).toBeNull();
  });

  it("surfaces an error and an empty list when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("boom", { status: 500 }))
    );

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.notifications).toEqual([]);
    expect(result.current.error).toBe("notifications request failed with status 500");
  });

  it("sends a request id header on every attempt", async () => {
    const fetchSpy = vi.fn(
      async () => new Response(JSON.stringify({ notifications: [] }), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchSpy);

    renderHook(() => useNotifications());

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));

    const [, init] = fetchSpy.mock.calls[0];
    const headers = init?.headers as Record<string, string>;
    expect(headers["X-Request-Id"]).toMatch(/^[0-9a-z-]+$/i);
  });

  it("logs the failure with the same request id sent on the request", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("boom", { status: 500 }))
    );
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const logged = JSON.parse(errorSpy.mock.calls[0][0] as string) as {
      event: string;
      requestId: string;
      message: string;
    };
    expect(logged.event).toBe("notifications_fetch_failed");
    expect(logged.requestId).toMatch(/^[0-9a-z-]+$/i);
    expect(logged.message).toBe("notifications request failed with status 500");
  });
});

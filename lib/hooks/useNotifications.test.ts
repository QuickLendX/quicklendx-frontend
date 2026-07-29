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
});

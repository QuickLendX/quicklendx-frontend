import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchJson } from "./api";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("fetchJson", () => {
  it("returns the parsed JSON body on a 2xx response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ hello: "world" }), { status: 200 }))
    );

    await expect(fetchJson("/api/thing", "thing")).resolves.toEqual({ hello: "world" });
  });

  it("throws with the label and status when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("boom", { status: 503 })));

    await expect(fetchJson("/api/thing", "thing")).rejects.toThrow(
      "thing request failed with status 503"
    );
  });

  it("forwards the init argument to fetch", async () => {
    const fetchSpy = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchSpy);

    await fetchJson("/api/thing", "thing", { headers: { "X-Test": "1" } });

    expect(fetchSpy).toHaveBeenCalledWith("/api/thing", { headers: { "X-Test": "1" } });
  });
});

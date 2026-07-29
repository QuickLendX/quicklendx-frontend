import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getJwks, __resetJwksCacheForTests, type Jwks } from "./jwks";

const SAMPLE_JWKS: Jwks = {
  keys: [{ kid: "k1", kty: "RSA", n: "mod", e: "AQAB" }],
};

function mockFetchOnce() {
  return vi.fn(async () => new Response(JSON.stringify(SAMPLE_JWKS), { status: 200 }));
}

beforeEach(() => {
  __resetJwksCacheForTests();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  __resetJwksCacheForTests();
});

describe("getJwks", () => {
  it("fetches and returns the JWKS document", async () => {
    const fetchMock = mockFetchOnce();
    vi.stubGlobal("fetch", fetchMock);

    const jwks = await getJwks();

    expect(jwks).toEqual(SAMPLE_JWKS);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/jwks");
  });

  it("does not re-fetch on a second call within the same tab (cache hit)", async () => {
    const fetchMock = mockFetchOnce();
    vi.stubGlobal("fetch", fetchMock);

    await getJwks();
    await getJwks();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("de-dupes concurrent in-tab callers behind a single in-flight request", async () => {
    const fetchMock = mockFetchOnce();
    vi.stubGlobal("fetch", fetchMock);

    const [a, b] = await Promise.all([getJwks(), getJwks()]);

    expect(a).toEqual(SAMPLE_JWKS);
    expect(b).toEqual(SAMPLE_JWKS);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("serves a cache entry written by a prior tab without fetching (cross-tab sharing)", async () => {
    // Simulate "another tab already cached this" by writing the cache
    // directly (what writeCache() does internally), then resetting only
    // the in-memory in-flight guard -- localStorage, unlike module-level
    // state, really is shared across tabs, so this is the accurate stand-in
    // for a fresh tab's first call.
    // The in-memory in-flight guard is already cleared by beforeEach, so
    // only localStorage carries state into this call -- exactly what a
    // fresh tab's first call would see.
    localStorage.setItem(
      "qlx_jwks_cache_v1",
      JSON.stringify({ jwks: SAMPLE_JWKS, cachedAt: Date.now() })
    );

    const fetchMock = mockFetchOnce();
    vi.stubGlobal("fetch", fetchMock);

    const jwks = await getJwks();

    expect(jwks).toEqual(SAMPLE_JWKS);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("re-fetches once the cached entry is past its TTL", async () => {
    const staleEntry = { jwks: SAMPLE_JWKS, cachedAt: Date.now() - 11 * 60 * 1000 };
    localStorage.setItem("qlx_jwks_cache_v1", JSON.stringify(staleEntry));

    const fetchMock = mockFetchOnce();
    vi.stubGlobal("fetch", fetchMock);

    await getJwks();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("propagates a fetch failure instead of caching it", async () => {
    const fetchMock = vi.fn(async () => new Response("boom", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getJwks()).rejects.toThrow("jwks fetch failed with status 500");
    expect(localStorage.getItem("qlx_jwks_cache_v1")).toBeNull();
  });
});

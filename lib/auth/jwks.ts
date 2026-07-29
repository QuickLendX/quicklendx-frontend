export interface JsonWebKey {
  kid: string;
  kty: string;
  n: string;
  e: string;
}

export interface Jwks {
  keys: JsonWebKey[];
}

const JWKS_ENDPOINT = "/api/auth/jwks";
const CACHE_KEY = "qlx_jwks_cache_v1";
const CACHE_TTL_MS = 10 * 60 * 1000;

interface CacheEntry {
  jwks: Jwks;
  cachedAt: number;
}

function readCache(): CacheEntry | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) return null;
    return entry;
  } catch {
    return null;
  }
}

function writeCache(jwks: Jwks): void {
  if (typeof localStorage === "undefined") return;
  try {
    const entry: CacheEntry = { jwks, cachedAt: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage can throw (private mode / quota exceeded) -- caching is
    // an optimization, not a correctness requirement, so just skip it.
  }
}

// De-dupes concurrent in-tab callers behind one in-flight request, so N
// components mounting at once still only trigger one fetch.
let inflight: Promise<Jwks> | null = null;

/**
 * Fetches and decodes the JWKS document, caching the decoded result in
 * `localStorage` for {@link CACHE_TTL_MS}. Since `localStorage` is shared
 * by every open tab on the same origin, a second tab that calls this
 * within the TTL reads the cached result instead of re-fetching and
 * re-parsing the JWKS itself.
 */
export async function getJwks(): Promise<Jwks> {
  const cached = readCache();
  if (cached) return cached.jwks;

  if (inflight) return inflight;

  inflight = fetch(JWKS_ENDPOINT)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`jwks fetch failed with status ${res.status}`);
      }
      const jwks = (await res.json()) as Jwks;
      writeCache(jwks);
      return jwks;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** Test-only: clears in-memory + localStorage cache state between tests. */
export function __resetJwksCacheForTests(): void {
  inflight = null;
  if (typeof localStorage !== "undefined") localStorage.removeItem(CACHE_KEY);
}

/**
 * The single fetch boundary for client hooks that call this app's own
 * `/api/*` route handlers, so the request/error-shape convention (throw on
 * a non-2xx response, parse JSON on success) lives in one place instead of
 * being copy-pasted into every hook that needs it.
 *
 * `label` names the resource in the thrown error message (e.g. `"alerts"`
 * -> `"alerts request failed with status 500"`), matching each hook's
 * existing, already-tested error text exactly.
 */
export async function fetchJson<T>(
  url: string,
  label: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`${label} request failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

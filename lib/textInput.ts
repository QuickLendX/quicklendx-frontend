/**
 * Trims leading/trailing whitespace from a raw text-input value and rejects
 * a value that is empty or whitespace-only, so callers get a typed result
 * instead of having to re-check `.trim().length` themselves at every call
 * site. Reject bad input at this boundary rather than deep inside the call
 * graph that eventually stores or displays it.
 */
export type TrimmedInputResult =
  | { ok: true; value: string }
  | { ok: false; error: "empty_after_trim" };

export function parseTrimmedInput(raw: string): TrimmedInputResult {
  const value = raw.trim();
  if (value.length === 0) {
    return { ok: false, error: "empty_after_trim" };
  }
  return { ok: true, value };
}

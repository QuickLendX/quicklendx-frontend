/**
 * Validates a date-range picker's `(start, end)` pair. Today nothing
 * rejects an inverted range, so a picker can silently produce `end` before
 * `start` and hand that downstream to whatever queries the range -- this
 * is the boundary that check belongs at, before the range ever leaves the
 * form.
 */
export type DateRangeResult =
  | { ok: true }
  | { ok: false; error: "end_before_start" | "invalid_date" };

export function validateDateRange(startIso: string, endIso: string): DateRangeResult {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) {
    return { ok: false, error: "invalid_date" };
  }
  if (end < start) {
    return { ok: false, error: "end_before_start" };
  }
  return { ok: true };
}

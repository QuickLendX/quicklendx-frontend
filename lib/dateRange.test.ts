import { describe, it, expect } from "vitest";
import { validateDateRange } from "./dateRange";

describe("validateDateRange", () => {
  it("rejects an end date before the start date", () => {
    // The bug this issue names: nothing currently stops end < start.
    expect(validateDateRange("2026-08-10", "2026-08-01")).toEqual({
      ok: false,
      error: "end_before_start",
    });
  });

  it("rejects an end date-time before the start date-time on the same day", () => {
    expect(
      validateDateRange("2026-08-10T15:00:00.000Z", "2026-08-10T09:00:00.000Z")
    ).toEqual({ ok: false, error: "end_before_start" });
  });

  it("accepts an end date equal to the start date (single-day range)", () => {
    expect(validateDateRange("2026-08-10", "2026-08-10")).toEqual({ ok: true });
  });

  it("accepts an end date after the start date", () => {
    expect(validateDateRange("2026-08-01", "2026-08-10")).toEqual({ ok: true });
  });

  it("rejects an unparseable start date", () => {
    expect(validateDateRange("not-a-date", "2026-08-10")).toEqual({
      ok: false,
      error: "invalid_date",
    });
  });

  it("rejects an unparseable end date", () => {
    expect(validateDateRange("2026-08-10", "not-a-date")).toEqual({
      ok: false,
      error: "invalid_date",
    });
  });
});

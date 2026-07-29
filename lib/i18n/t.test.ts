import { describe, it, expect, vi, afterEach } from "vitest";
import { t } from "./t";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("t", () => {
  it("returns the translated value for a key that exists", () => {
    expect(t("nav.dashboard")).toBe("Dashboard");
  });

  it("falls back to the raw key when it exists in no locale, and warns", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(t("totally.unknown.key")).toBe("totally.unknown.key");

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain("totally.unknown.key");
  });

  it("never throws for a missing key", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(() => t("")).not.toThrow();
    expect(() => t("nested.deeply.missing.key")).not.toThrow();
  });
});

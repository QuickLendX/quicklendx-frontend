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

  it("returns the locale's own translation when it has the key", () => {
    expect(t("nav.dashboard", "es")).toBe("Panel");
  });

  it("falls back to the default locale's value when the given locale lacks the key, and warns", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    // "dashboard.empty.title" exists in "en" (the default) but was never
    // translated for "es" -- this is the fallback path itself, distinct
    // from the "missing in every locale" path covered above.
    expect(t("dashboard.empty.title", "es")).toBe("No invoices yet");

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const [message] = warnSpy.mock.calls[0];
    expect(message).toContain("dashboard.empty.title");
    expect(message).toContain("es");
    expect(message).toContain("en");
  });

  it("does not warn when the requested locale already has the key", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    t("nav.portfolio", "es");

    expect(warnSpy).not.toHaveBeenCalled();
  });
});

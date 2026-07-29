import { describe, it, expect, vi, afterEach } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("DEFAULT_LOCALE", () => {
  it("defaults to 'en' when DEFAULT_LOCALE is unset", async () => {
    vi.stubEnv("DEFAULT_LOCALE", undefined);
    vi.resetModules();
    const { DEFAULT_LOCALE } = await import("./messages");
    expect(DEFAULT_LOCALE).toBe("en");
  });

  it("honors DEFAULT_LOCALE when it names a locale that exists", async () => {
    vi.stubEnv("DEFAULT_LOCALE", "en");
    vi.resetModules();
    const { DEFAULT_LOCALE } = await import("./messages");
    expect(DEFAULT_LOCALE).toBe("en");
  });

  it("falls back to 'en' when DEFAULT_LOCALE names a locale that doesn't exist", async () => {
    vi.stubEnv("DEFAULT_LOCALE", "fr");
    vi.resetModules();
    const { DEFAULT_LOCALE } = await import("./messages");
    expect(DEFAULT_LOCALE).toBe("en");
  });

  it("falls back to 'en' for an empty-string env value", async () => {
    vi.stubEnv("DEFAULT_LOCALE", "");
    vi.resetModules();
    const { DEFAULT_LOCALE } = await import("./messages");
    expect(DEFAULT_LOCALE).toBe("en");
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("config", () => {
  it("returns the SENTRY_DSN value when the env var is set", async () => {
    vi.stubEnv("SENTRY_DSN", "https://key@o123.ingest.sentry.io/456");
    vi.resetModules();
    const { default: config } = await import("./config");
    expect(config.sentryDsn).toBe("https://key@o123.ingest.sentry.io/456");
  });

  it("defaults to an empty string when SENTRY_DSN is unset", async () => {
    vi.stubEnv("SENTRY_DSN", undefined);
    vi.resetModules();
    const { default: config } = await import("./config");
    expect(config.sentryDsn).toBe("");
  });

  it("returns the STELLAR_NETWORK value when set to a recognized network", async () => {
    vi.stubEnv("STELLAR_NETWORK", "mainnet");
    vi.resetModules();
    const { default: config } = await import("./config");
    expect(config.stellarNetwork).toBe("mainnet");
  });

  it("defaults stellarNetwork to testnet when STELLAR_NETWORK is unset", async () => {
    vi.stubEnv("STELLAR_NETWORK", undefined);
    vi.resetModules();
    const { default: config } = await import("./config");
    expect(config.stellarNetwork).toBe("testnet");
  });

  it("defaults stellarNetwork to testnet when STELLAR_NETWORK is unrecognized", async () => {
    vi.stubEnv("STELLAR_NETWORK", "devnet");
    vi.resetModules();
    const { default: config } = await import("./config");
    expect(config.stellarNetwork).toBe("testnet");
  });
});

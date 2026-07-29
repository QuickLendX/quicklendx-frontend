import { describe, it, expect, vi, afterEach } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("captureClientError", () => {
  it("logs an error entry with the scoped tag when Sentry is enabled", async () => {
    vi.stubEnv("SENTRY_DSN", "https://key@o123.ingest.sentry.io/456");
    vi.resetModules();
    const { captureClientError } = await import("./sentry");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = captureClientError(new Error("payout submit failed"), "payout-form");

    expect(result).toEqual({ sent: true, tag: "payout-form" });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const logged = JSON.parse(errorSpy.mock.calls[0][0] as string) as {
      event: string;
      tag: string;
      message: string;
    };
    expect(logged.event).toBe("client_error_captured");
    expect(logged.tag).toBe("payout-form");
    expect(logged.message).toBe("payout submit failed");
  });

  it("drops the error and warns instead of sending when Sentry is disabled", async () => {
    vi.stubEnv("SENTRY_DSN", undefined);
    vi.resetModules();
    const { captureClientError } = await import("./sentry");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = captureClientError(new Error("boom"), "invoice-fetch");

    expect(result).toEqual({ sent: false, tag: "invoice-fetch" });
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const logged = JSON.parse(warnSpy.mock.calls[0][0] as string) as { reason: string };
    expect(logged.reason).toBe("sentry_disabled");
  });

  it("scopes different tags independently in the log output", async () => {
    vi.stubEnv("SENTRY_DSN", "https://key@o123.ingest.sentry.io/456");
    vi.resetModules();
    const { captureClientError } = await import("./sentry");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    captureClientError(new Error("e1"), "payout-form");
    captureClientError(new Error("e2"), "invoice-fetch");

    const tags = errorSpy.mock.calls.map(
      (call) => (JSON.parse(call[0] as string) as { tag: string }).tag
    );
    expect(tags).toEqual(["payout-form", "invoice-fetch"]);
  });
});

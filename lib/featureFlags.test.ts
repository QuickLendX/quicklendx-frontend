import { describe, it, expect, vi, afterEach } from "vitest";

const ENV_KEY = "NEXT_PUBLIC_FEATURE_NEW_DASHBOARD_LAYOUT";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("isFeatureEnabled", () => {
  it("is disabled when the env var is unset", async () => {
    vi.stubEnv(ENV_KEY, undefined);
    vi.resetModules();
    const { isFeatureEnabled } = await import("./featureFlags");
    expect(isFeatureEnabled("newDashboardLayout")).toBe(false);
  });

  it('is enabled only for the exact string "true"', async () => {
    vi.stubEnv(ENV_KEY, "true");
    vi.resetModules();
    const { isFeatureEnabled } = await import("./featureFlags");
    expect(isFeatureEnabled("newDashboardLayout")).toBe(true);
  });

  it("is disabled for any other value, including truthy-looking ones", async () => {
    for (const value of ["1", "TRUE", "yes", "false", ""]) {
      vi.stubEnv(ENV_KEY, value);
      vi.resetModules();
      const { isFeatureEnabled } = await import("./featureFlags");
      expect(isFeatureEnabled("newDashboardLayout")).toBe(false);
    }
  });
});

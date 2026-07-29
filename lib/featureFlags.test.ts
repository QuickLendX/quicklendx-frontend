import { afterEach, describe, expect, it } from "vitest";
import { FEATURE_FLAG_ENV_KEYS, isFeatureEnabled } from "./featureFlags";

const ENV_KEY = FEATURE_FLAG_ENV_KEYS.newDashboardLayout;
const ORIGINAL = process.env[ENV_KEY];

afterEach(() => {
  if (ORIGINAL === undefined) delete process.env[ENV_KEY];
  else process.env[ENV_KEY] = ORIGINAL;
});

describe("isFeatureEnabled", () => {
  it("is disabled when the env var is unset", () => {
    delete process.env[ENV_KEY];
    expect(isFeatureEnabled("newDashboardLayout")).toBe(false);
  });

  it("is enabled only for the exact string \"true\"", () => {
    process.env[ENV_KEY] = "true";
    expect(isFeatureEnabled("newDashboardLayout")).toBe(true);
  });

  it("is disabled for any other value, including truthy-looking ones", () => {
    for (const value of ["1", "TRUE", "yes", "false", ""]) {
      process.env[ENV_KEY] = value;
      expect(isFeatureEnabled("newDashboardLayout")).toBe(false);
    }
  });
});

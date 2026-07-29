/**
 * Feature flags read from environment variables (`NEXT_PUBLIC_FEATURE_*`),
 * not hardcoded in source. Flipping a flag should never require a code
 * change/redeploy of the flag's own definition -- only of the environment
 * it's read from.
 *
 * Add a new flag by adding its key to {@link FEATURE_FLAG_ENV_KEYS} below;
 * `isFeatureEnabled` reads `process.env[key]` and treats exactly the
 * string `"true"` as enabled -- unset, empty, or any other value is
 * disabled, so a flag defaults closed rather than needing every
 * environment to explicitly opt out.
 */
export const FEATURE_FLAG_ENV_KEYS = {
  newDashboardLayout: "NEXT_PUBLIC_FEATURE_NEW_DASHBOARD_LAYOUT",
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAG_ENV_KEYS;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return process.env[FEATURE_FLAG_ENV_KEYS[flag]] === "true";
}

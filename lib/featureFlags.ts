import config, { type FeatureFlags } from "./config";

export type { FeatureFlags } from "./config";
export { FEATURE_FLAG_ENV_KEYS } from "./config";

/** Convenience accessor for a single flag. Reads through `lib/config.ts`,
 * the single source of truth for env-derived values -- never `process.env`
 * directly (see the README's "Environment variables" section). */
export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return config.featureFlags[flag];
}

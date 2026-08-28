export type StellarNetwork = "testnet" | "mainnet";

/**
 * Feature flags, keyed by name and backed by a `NEXT_PUBLIC_FEATURE_*` env
 * var -- not hardcoded in source, so flipping one never requires a code
 * change of the flag's own definition, only of the environment it's read
 * from. Add a new flag by adding its key here and to
 * {@link FEATURE_FLAG_ENV_KEYS} below.
 */
export type FeatureFlags = {
  newDashboardLayout: boolean;
};

export const FEATURE_FLAG_ENV_KEYS: Record<keyof FeatureFlags, string> = {
  newDashboardLayout: "NEXT_PUBLIC_FEATURE_NEW_DASHBOARD_LAYOUT",
};

export type Config = {
  sentryDsn: string;
  stellarNetwork: StellarNetwork;
  featureFlags: FeatureFlags;
};

const DEFAULT_STELLAR_NETWORK: StellarNetwork = "testnet";

/** Sane default first, environment override second -- an unset or
 * unrecognized `STELLAR_NETWORK` value falls back to testnet rather than
 * silently pointing the client at mainnet. */
function readStellarNetwork(): StellarNetwork {
  const raw = process.env.STELLAR_NETWORK;
  return raw === "mainnet" || raw === "testnet" ? raw : DEFAULT_STELLAR_NETWORK;
}

/** A flag is enabled only for the exact string `"true"` -- unset, empty,
 * or any other value defaults closed, so a new flag never needs every
 * environment to explicitly opt out. */
function readFeatureFlags(): FeatureFlags {
  return {
    newDashboardLayout: process.env[FEATURE_FLAG_ENV_KEYS.newDashboardLayout] === "true",
  };
}

const config: Config = {
  sentryDsn: process.env.SENTRY_DSN ?? "",
  stellarNetwork: readStellarNetwork(),
  featureFlags: readFeatureFlags(),
};

export default config;

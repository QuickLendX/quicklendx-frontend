export type StellarNetwork = "testnet" | "mainnet";

export type Config = {
  sentryDsn: string;
  stellarNetwork: StellarNetwork;
};

const DEFAULT_STELLAR_NETWORK: StellarNetwork = "testnet";

/** Sane default first, environment override second -- an unset or
 * unrecognized `STELLAR_NETWORK` value falls back to testnet rather than
 * silently pointing the client at mainnet. */
function readStellarNetwork(): StellarNetwork {
  const raw = process.env.STELLAR_NETWORK;
  return raw === "mainnet" || raw === "testnet" ? raw : DEFAULT_STELLAR_NETWORK;
}

const config: Config = {
  sentryDsn: process.env.SENTRY_DSN ?? "",
  stellarNetwork: readStellarNetwork(),
};

export default config;

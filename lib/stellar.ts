/**
 * Structural validation for a Stellar public key ("G..." address), used to
 * reject obviously-wrong payout destinations client-side before a payout
 * request is ever submitted. A wrong or malformed address here means funds
 * sent on-chain are unrecoverable, so this check fails closed: anything
 * that isn't shaped like a StrKey-encoded ed25519 public key is rejected.
 *
 * This checks structure (version byte + base32 alphabet + length) only, not
 * the trailing CRC16 checksum -- good enough to catch pasted addresses from
 * the wrong chain (e.g. Ethereum's `0x...`) or truncated/garbled input.
 * Full checksum verification belongs server-side (or via `@stellar/strkey`)
 * before any transaction is built.
 */
const STELLAR_PUBLIC_KEY_PATTERN = /^G[A-Z2-7]{55}$/;

export function isValidStellarPublicKey(address: string): boolean {
  return STELLAR_PUBLIC_KEY_PATTERN.test(address);
}

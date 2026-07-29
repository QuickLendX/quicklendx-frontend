/**
 * Invoice totals live on-chain as `i128` stroops (Stellar's integer minor
 * unit, 1 XLM = 10_000_000 stroops). The UI must carry that value as a
 * `bigint` end-to-end and only convert to a display string at the last
 * moment -- never as a JS `number`, which cannot represent the full i128
 * range without precision loss.
 */
export const STROOPS_PER_XLM = 10_000_000n;

/** Formats a stroops amount as a fixed-point XLM string, e.g. `12.5000000`. */
export function formatStroops(amount: bigint): string {
  const negative = amount < 0n;
  const abs = negative ? -amount : amount;
  const whole = abs / STROOPS_PER_XLM;
  const frac = abs % STROOPS_PER_XLM;
  const fracStr = frac.toString().padStart(7, "0");
  return `${negative ? "-" : ""}${whole.toString()}.${fracStr}`;
}

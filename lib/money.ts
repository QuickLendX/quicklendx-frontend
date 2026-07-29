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

/** Largest value the on-chain escrow contract's `i128` invoice-amount field
 * can hold (2^127 - 1). Any stroops amount above this cannot be represented
 * on-chain, so it must be rejected before it ever reaches a contract call. */
export const INVOICE_AMOUNT_MAX_STROOPS = 170_141_183_460_469_231_731_687_303_715_884_105_727n;

export type ParsedInvoiceAmount =
  | { ok: true; amountStroops: bigint }
  | { ok: false; error: string };

/** Parses a decimal XLM string (as typed by a user, e.g. `"12.5"`) into a
 * stroops `bigint` and rejects anything the on-chain `i128` field cannot
 * hold. This is the boundary check -- callers should reject bad input here
 * rather than passing an out-of-range amount deeper into the call graph. */
export function parseInvoiceAmount(input: string): ParsedInvoiceAmount {
  const trimmed = input.trim();
  if (!/^\d+(\.\d{1,7})?$/.test(trimmed)) {
    return { ok: false, error: "Enter a positive amount with up to 7 decimal places." };
  }

  const [wholePart, fracPart = ""] = trimmed.split(".");
  const stroops =
    BigInt(wholePart) * STROOPS_PER_XLM + BigInt(fracPart.padEnd(7, "0") || "0");

  if (stroops > INVOICE_AMOUNT_MAX_STROOPS) {
    return { ok: false, error: "Amount exceeds the maximum an invoice can hold on-chain." };
  }

  return { ok: true, amountStroops: stroops };
}

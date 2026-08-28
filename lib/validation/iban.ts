export interface IbanValidationResult {
  ok: boolean;
  error: string | null;
}

const IBAN_FORMAT = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/;

/**
 * Validates an IBAN per ISO 13616: format, then the mod-97 checksum.
 *
 * The checksum is computed with `BigInt` rather than `Number` -- an IBAN's
 * numeric form (after moving the first 4 characters to the end and mapping
 * letters to two-digit numbers) is well beyond `Number.MAX_SAFE_INTEGER`
 * for any IBAN longer than ~15 characters, so a plain-number mod would
 * silently give the wrong answer instead of throwing.
 */
export function validateIban(rawInput: string): IbanValidationResult {
  const value = rawInput.replace(/\s+/g, "").toUpperCase();

  if (!IBAN_FORMAT.test(value)) {
    return { ok: false, error: "Enter a valid IBAN (e.g. DE89 3704 0044 0532 0130 00)." };
  }

  const rearranged = value.slice(4) + value.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (letter) => String(letter.charCodeAt(0) - 55));

  let remainder = 0n;
  for (const digit of numeric) {
    remainder = (remainder * 10n + BigInt(digit)) % 97n;
  }

  if (remainder !== 1n) {
    return { ok: false, error: "This IBAN's check digits don't match -- check for a typo." };
  }

  return { ok: true, error: null };
}

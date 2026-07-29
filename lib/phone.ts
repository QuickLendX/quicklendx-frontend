import { parsePhoneNumberFromString } from "libphonenumber-js";

export type PhoneValidationResult =
  | { ok: true; e164: string }
  | { ok: false; error: "invalid_phone_number" };

/**
 * Validates a user-entered phone number via `libphonenumber-js` -- real
 * number-plan validation (country dialing codes, national number length
 * and pattern per region), not a regex that merely checks for digits.
 * Reject bad input at this boundary rather than deep inside whatever
 * eventually dials or SMS-verifies it.
 *
 * `defaultCountry` disambiguates a national-format number with no `+`
 * prefix (e.g. a US number entered as `"2015550123"`); an already-
 * international number (`"+1 201..."`) doesn't need it.
 */
export function validatePhoneNumber(
  raw: string,
  defaultCountry?: Parameters<typeof parsePhoneNumberFromString>[1]
): PhoneValidationResult {
  const parsed = parsePhoneNumberFromString(raw, defaultCountry);
  if (!parsed || !parsed.isValid()) {
    return { ok: false, error: "invalid_phone_number" };
  }
  return { ok: true, e164: parsed.number };
}

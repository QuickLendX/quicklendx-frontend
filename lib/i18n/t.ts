import { locales, DEFAULT_LOCALE, type Locale } from "./messages";

/**
 * Translates `key` for `locale`.
 *
 * Falls back to {@link DEFAULT_LOCALE}'s value if `locale`'s dictionary
 * doesn't have `key`, and falls back to the raw key itself if no locale
 * has it at all -- so a missing or mistyped key renders something legible
 * instead of "undefined" or a thrown error. Either fallback logs a
 * dev-time warning so it doesn't ship silently.
 */
export function t(key: string, locale: Locale = DEFAULT_LOCALE): string {
  const dict: Record<string, string> = locales[locale];
  if (key in dict) return dict[key];

  const fallbackDict: Record<string, string> = locales[DEFAULT_LOCALE];
  if (key in fallbackDict) {
    warnMissingKey(`missing key "${key}" for locale "${locale}"; falling back to "${DEFAULT_LOCALE}"`);
    return fallbackDict[key];
  }

  warnMissingKey(`missing key "${key}" in every locale; rendering the raw key`);
  return key;
}

function warnMissingKey(message: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[i18n] ${message}`);
  }
}

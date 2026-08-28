import { en, locales, DEFAULT_LOCALE, type Locale, type MessageKey } from "./messages";

export interface PendingTranslations {
  locale: Locale;
  keys: MessageKey[];
}

/**
 * Keys present in `en` (the source of truth -- see
 * `docs/i18n-message-extraction.md`) but missing from a locale's own
 * (intentionally partial) dictionary. Used to surface untranslated keys
 * during development, not meant for production UI.
 */
export function getPendingTranslations(locale: Locale): MessageKey[] {
  const dict: Partial<Record<MessageKey, string>> = locales[locale];
  return (Object.keys(en) as MessageKey[]).filter((key) => !(key in dict));
}

/** {@link getPendingTranslations} for every non-default locale. */
export function getAllPendingTranslations(): PendingTranslations[] {
  return (Object.keys(locales) as Locale[])
    .filter((locale) => locale !== DEFAULT_LOCALE)
    .map((locale) => ({ locale, keys: getPendingTranslations(locale) }));
}

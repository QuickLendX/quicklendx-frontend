export const en = {
  "nav.dashboard": "Dashboard",
  "nav.portfolio": "Portfolio",
  "dashboard.empty.title": "No invoices yet",
  "dashboard.empty.description": "Invoices you post or fund will show up here.",
  "portfolio.empty.title": "Your portfolio is empty",
  "portfolio.empty.description": "Fund an invoice to start building your portfolio.",
} as const;

export type MessageKey = keyof typeof en;

export const locales = { en } as const;

export type Locale = keyof typeof locales;

const FALLBACK_DEFAULT_LOCALE: Locale = "en";

function isKnownLocale(value: string): value is Locale {
  return value in locales;
}

/** The app-wide default locale, sourced from `DEFAULT_LOCALE` -- sane
 * default first (`"en"`), environment override second. An unset or
 * unrecognized env value (a locale that isn't in {@link locales}) falls
 * back to the default rather than producing a `Locale` that doesn't
 * actually have a message dictionary. */
export const DEFAULT_LOCALE: Locale = (() => {
  const fromEnv = process.env.DEFAULT_LOCALE;
  if (fromEnv && isKnownLocale(fromEnv)) return fromEnv;
  return FALLBACK_DEFAULT_LOCALE;
})();

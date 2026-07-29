export const en = {
  "nav.dashboard": "Dashboard",
  "nav.portfolio": "Portfolio",
  "dashboard.empty.title": "No invoices yet",
  "dashboard.empty.description": "Invoices you post or fund will show up here.",
  "portfolio.empty.title": "Your portfolio is empty",
  "portfolio.empty.description": "Fund an invoice to start building your portfolio.",
} as const;

export type MessageKey = keyof typeof en;

/** Intentionally partial: only translated for the keys product has signed
 * off on so far. Untranslated keys fall back to {@link DEFAULT_LOCALE} via
 * `t()` -- see `lib/i18n/t.test.ts` for coverage of that fallback path. */
export const es: Partial<Record<MessageKey, string>> = {
  "nav.dashboard": "Panel",
  "nav.portfolio": "Cartera",
};

export const locales = { en, es } as const;

export type Locale = keyof typeof locales;

export const DEFAULT_LOCALE: Locale = "en";

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

export const DEFAULT_LOCALE: Locale = "en";

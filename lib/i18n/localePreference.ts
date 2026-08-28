"use client";

import { log } from "@/lib/logger";
import { DEFAULT_LOCALE, type Locale, locales } from "./messages";

const STORAGE_KEY = "qlx.locale";

function isKnownLocale(value: string | null): value is Locale {
  return value !== null && value in locales;
}

/** Reads the user's persisted locale preference, or `null` if unset/invalid
 * (including when called on the server, where `localStorage` doesn't exist). */
export function getStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return isKnownLocale(raw) ? raw : null;
}

/**
 * Persists a new locale preference and logs a breadcrumb for it.
 *
 * Structured fields only (`from`/`to` locale codes) -- no free-form
 * message -- so the switch is easy to correlate with whatever a user
 * reports going wrong afterward (locale switches are a common trigger for
 * locale-dependent formatting/layout bugs).
 */
export function setLocalePreference(next: Locale): void {
  const from = getStoredLocale() ?? DEFAULT_LOCALE;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  if (from !== next) {
    log("info", "locale_switched", { from, to: next });
  }
}

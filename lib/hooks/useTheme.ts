"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function getSystemTheme(): Theme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/** Tracks the OS-level `prefers-color-scheme` setting as `"light"` |
 * `"dark"`. Defaults to `"light"` when `matchMedia` isn't available (SSR,
 * or an old browser) rather than throwing, and stays in sync with live OS
 * theme changes -- e.g. the user's system switching to dark mode at
 * sunset -- without a page reload. */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(getSystemTheme);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const mql = window.matchMedia(DARK_QUERY);
    const onChange = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return theme;
}

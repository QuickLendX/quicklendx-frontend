"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSidebar } from "./SidebarProvider";
import { DashboardIcon, PortfolioIcon } from "./icons";
import { log } from "@/lib/logger";

// Route-preload hints fire on every hover of every nav link -- far too
// high-frequency to log at "info" without drowning out real signal, so
// this is "debug" only (see lib/logger.ts).
function logRoutePreload(href: string): void {
  log("debug", "route_preload", { href });
}
import { getAllPendingTranslations } from "@/lib/i18n/pendingTranslations";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { href: "/portfolio", label: "Portfolio", Icon: PortfolioIcon },
];

const NAV_LIST_ID = "primary-navigation-links";

/** Dev-only: surfaces untranslated i18n keys right where a contributor is
 * already looking, instead of only being discoverable by reading
 * `lib/i18n/messages.ts` or catching a console warning at the exact
 * moment a missing key is hit. Never rendered in production. */
function PendingTranslationsNotice() {
  if (process.env.NODE_ENV === "production") return null;

  const pending = getAllPendingTranslations().filter((entry) => entry.keys.length > 0);
  if (pending.length === 0) return null;

  return (
    <p className="sidebar-pending-translations" role="status">
      {pending.map((entry) => `${entry.locale}: ${entry.keys.length} pending`).join(", ")}
    </p>
  );
}

/** Primary app navigation with a collapse toggle. Collapse state lives in
 * {@link useSidebar} (owned by the shared `(app)` layout) so it survives
 * navigating between pages instead of resetting on every route change. */
export function Sidebar() {
  const { collapsed, toggle } = useSidebar();

  return (
    <nav aria-label="Primary" className={collapsed ? "sidebar sidebar-collapsed" : "sidebar"}>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={collapsed}
        aria-expanded={!collapsed}
        aria-controls={NAV_LIST_ID}
      >
        {collapsed ? "Expand" : "Collapse"}
      </button>
      {!collapsed ? (
        <ul>
          {NAV_LINKS.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link href={href} onMouseEnter={() => logRoutePreload(href)}>
                <Suspense fallback={null}>
                  <Icon />
                </Suspense>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {!collapsed ? <PendingTranslationsNotice /> : null}
    </nav>
  );
}

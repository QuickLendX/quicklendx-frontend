"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSidebar } from "./SidebarProvider";
import { DashboardIcon, PortfolioIcon } from "./icons";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
  { href: "/portfolio", label: "Portfolio", Icon: PortfolioIcon },
];

const NAV_LIST_ID = "primary-navigation-links";

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
              <Link href={href}>
                <Suspense fallback={null}>
                  <Icon />
                </Suspense>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}

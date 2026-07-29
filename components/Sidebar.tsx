"use client";

import Link from "next/link";
import { useSidebar } from "./SidebarProvider";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/portfolio", label: "Portfolio" },
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
        <ul id={NAV_LIST_ID}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}

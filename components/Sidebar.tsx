"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/portfolio", label: "Portfolio" },
];

/** Primary app navigation with a collapse toggle. */
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav aria-label="Primary" className={collapsed ? "sidebar sidebar-collapsed" : "sidebar"}>
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-pressed={collapsed}
      >
        {collapsed ? "Expand" : "Collapse"}
      </button>
      {!collapsed ? (
        <ul>
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

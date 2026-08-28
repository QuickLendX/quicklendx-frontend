"use client";

import { useState } from "react";

/** The heavier, interactive half of the settings route -- split into its
 * own chunk (see `app/(app)/settings/page.tsx`) so visiting /dashboard or
 * /portfolio never pays for this code until a user actually opens
 * /settings. */
export function SettingsPanel() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [compactView, setCompactView] = useState(false);

  return (
    <section aria-label="Settings">
      <label>
        <input
          type="checkbox"
          checked={emailNotifications}
          onChange={(event) => setEmailNotifications(event.target.checked)}
        />
        Email notifications
      </label>
      <label>
        <input
          type="checkbox"
          checked={compactView}
          onChange={(event) => setCompactView(event.target.checked)}
        />
        Compact view
      </label>
    </section>
  );
}

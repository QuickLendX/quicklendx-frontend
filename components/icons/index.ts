import { lazy } from "react";

/** The app's icon set, each icon code-split into its own chunk via
 * `React.lazy` instead of being bundled into whatever mounts first (the
 * sidebar). This keeps the icon set free to grow without adding weight to
 * every route's initial JS -- only the icons actually rendered ever load. */
export const DashboardIcon = lazy(() => import("./DashboardIcon"));
export const PortfolioIcon = lazy(() => import("./PortfolioIcon"));

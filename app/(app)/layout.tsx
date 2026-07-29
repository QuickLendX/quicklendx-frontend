import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/SidebarProvider";

/** Shared shell for every authenticated route. Mounted once and kept alive
 * across navigation within this route group, so SidebarProvider's collapse
 * state survives moving between /dashboard and /portfolio (#98) instead of
 * each page owning its own Sidebar instance. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="app-shell">
        <Sidebar />
        <main>{children}</main>
      </div>
    </SidebarProvider>
  );
}

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { Sidebar } from "./Sidebar";
import { SidebarProvider } from "./SidebarProvider";

afterEach(() => {
  vi.restoreAllMocks();
});

function renderSidebar() {
  return render(
    <SidebarProvider>
      <Sidebar />
    </SidebarProvider>
  );
}

describe("Sidebar", () => {
  it("toggles between collapsed and expanded on click", async () => {
    const user = userEvent.setup();
    renderSidebar();

    const toggle = screen.getByRole("button");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Dashboard" })).not.toBeInTheDocument();
  });

  it("keeps the primary navigation in a predictable tab order when expanded", async () => {
    const user = userEvent.setup();
    renderSidebar();

    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("link", { name: "Portfolio" })).toHaveFocus();
  });

  it("throws when rendered outside a SidebarProvider", () => {
    expect(() => render(<Sidebar />)).toThrow(
      "useSidebar must be used within a SidebarProvider"
    );
  });

  it("shares collapse state across every consumer of the same provider (#98)", async () => {
    // The (app) layout mounts exactly one SidebarProvider above the route
    // segment, so every page under it reads the same collapse state instead
    // of each page owning its own -- this is what makes the state survive a
    // route change (the provider, unlike the page, never unmounts).
    // Rendering two Sidebar consumers under one provider here is a stand-in
    // for "the same collapse state as seen from two different pages."
    const user = userEvent.setup();
    render(
      <SidebarProvider>
        <Sidebar />
        <div data-testid="second-consumer">
          <Sidebar />
        </div>
      </SidebarProvider>
    );

    const [firstToggle, secondToggle] = screen.getAllByRole("button");
    expect(firstToggle).toHaveAttribute("aria-pressed", "false");
    expect(secondToggle).toHaveAttribute("aria-pressed", "false");

    await user.click(firstToggle);

    expect(firstToggle).toHaveAttribute("aria-pressed", "true");
    expect(secondToggle).toHaveAttribute("aria-pressed", "true");
  });

  it("logs a route-preload hint at debug (not info) on nav-link hover", async () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const user = userEvent.setup();
    renderSidebar();

    await user.hover(screen.getByRole("link", { name: "Portfolio" }));

    expect(debugSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy).not.toHaveBeenCalled();
    const parsed = JSON.parse(debugSpy.mock.calls[0][0] as string);
    expect(parsed).toMatchObject({ level: "debug", event: "route_preload", href: "/portfolio" });
  });

  it("surfaces the count of pending (untranslated) keys for es outside production", () => {
    renderSidebar();

    // es only translates nav.dashboard/nav.portfolio today (see
    // lib/i18n/messages.ts) -- everything else in `en` is pending.
    expect(screen.getByRole("status")).toHaveTextContent(/es: \d+ pending/);
  });

  it("hides the pending-translations notice in production", () => {
    const original = process.env.NODE_ENV;
    // @ts-expect-error -- NODE_ENV is readonly in the ambient types, but
    // assignable at runtime; this is the standard way to test prod-only
    // branches.
    process.env.NODE_ENV = "production";

    renderSidebar();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    // @ts-expect-error -- see above
    process.env.NODE_ENV = original;
  });

  it("hides the notice when collapsed, same as the rest of the nav content", async () => {
    const user = userEvent.setup();
    renderSidebar();

    await user.click(screen.getByRole("button"));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

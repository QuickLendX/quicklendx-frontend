import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Sidebar } from "./Sidebar";
import { SidebarProvider } from "./SidebarProvider";

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
});

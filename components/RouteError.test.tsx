import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { RouteError } from "./RouteError";

describe("RouteError", () => {
  it("shows a route failure message and lets the user retry", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<RouteError message="Dashboard failed to load." onRetry={onRetry} />);

    expect(screen.getByRole("alert")).toHaveTextContent("We could not load this page");
    expect(screen.getByText("Dashboard failed to load.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

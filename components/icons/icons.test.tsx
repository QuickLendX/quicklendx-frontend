import { render, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { describe, it, expect } from "vitest";
import { DashboardIcon, PortfolioIcon } from "./index";

describe("icon set", () => {
  it("lazily renders the dashboard icon inside its Suspense boundary", async () => {
    const { container } = render(
      <Suspense fallback={<span data-testid="icon-fallback" />}>
        <DashboardIcon />
      </Suspense>
    );

    await waitFor(() => expect(container.querySelector("svg")).toBeInTheDocument());
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("lazily renders the portfolio icon inside its Suspense boundary", async () => {
    const { container } = render(
      <Suspense fallback={null}>
        <PortfolioIcon />
      </Suspense>
    );

    await waitFor(() => expect(container.querySelector("svg")).toBeInTheDocument());
  });
});

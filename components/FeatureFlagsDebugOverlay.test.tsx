import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { FeatureFlagsDebugOverlay } from "./FeatureFlagsDebugOverlay";

function setSearch(search: string) {
  window.history.pushState({}, "", `/${search}`);
}

afterEach(() => {
  setSearch("");
});

describe("FeatureFlagsDebugOverlay", () => {
  it("renders nothing without ?debug=1", () => {
    render(<FeatureFlagsDebugOverlay />);
    expect(screen.queryByTestId("feature-flags-debug-overlay")).not.toBeInTheDocument();
  });

  it("renders the current config when ?debug=1 is present", async () => {
    setSearch("?debug=1");
    render(<FeatureFlagsDebugOverlay />);

    await waitFor(() =>
      expect(screen.getByTestId("feature-flags-debug-overlay")).toBeInTheDocument()
    );
    expect(screen.getByText(/stellarNetwork/)).toBeInTheDocument();
  });

  it("does not render for an unrelated query value", () => {
    setSearch("?debug=true");
    render(<FeatureFlagsDebugOverlay />);
    expect(screen.queryByTestId("feature-flags-debug-overlay")).not.toBeInTheDocument();
  });
});

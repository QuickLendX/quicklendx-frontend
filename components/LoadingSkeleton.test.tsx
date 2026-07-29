import { act, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LoadingSkeleton } from "./LoadingSkeleton";

describe("LoadingSkeleton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders a status region with the requested number of rows", () => {
    render(<LoadingSkeleton rows={4} />);

    const status = screen.getByRole("status", { name: "Loading" });
    expect(status.children).toHaveLength(4);
  });

  it("advances its shimmer frame on an interval while mounted", () => {
    render(<LoadingSkeleton />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("data-shimmer-frame", "0");

    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(status).toHaveAttribute("data-shimmer-frame", "1");
  });

  it("clears its shimmer interval on unmount, leaving no pending timers", () => {
    const { unmount } = render(<LoadingSkeleton />);
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it("never updates state after unmount, even if the clock keeps advancing", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { unmount } = render(<LoadingSkeleton />);

    unmount();
    vi.advanceTimersByTime(10_000);

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

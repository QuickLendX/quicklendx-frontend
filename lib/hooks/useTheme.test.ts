import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useTheme } from "./useTheme";

type Listener = (event: MediaQueryListEvent) => void;

function stubMatchMedia(initialMatches: boolean) {
  let listener: Listener | null = null;
  const mql = {
    matches: initialMatches,
    media: "(prefers-color-scheme: dark)",
    addEventListener: vi.fn((_event: string, cb: Listener) => {
      listener = cb;
    }),
    removeEventListener: vi.fn(),
  };
  const matchMediaSpy = vi.fn(() => mql);
  vi.stubGlobal("matchMedia", matchMediaSpy);

  return {
    mql,
    matchMediaSpy,
    fireChange(matches: boolean) {
      act(() => {
        listener?.({ matches } as MediaQueryListEvent);
      });
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("useTheme", () => {
  it("returns 'dark' when the system prefers dark", () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe("dark");
  });

  it("returns 'light' when the system prefers light", () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe("light");
  });

  it("updates when the OS-level preference changes while mounted", () => {
    const { fireChange } = stubMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe("light");

    fireChange(true);
    expect(result.current).toBe("dark");

    fireChange(false);
    expect(result.current).toBe("light");
  });

  it("removes the change listener on unmount", () => {
    const { mql } = stubMatchMedia(false);
    const { unmount } = renderHook(() => useTheme());

    unmount();

    expect(mql.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("defaults to 'light' when matchMedia is unavailable", () => {
    vi.stubGlobal("matchMedia", undefined);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe("light");
  });
});

import { act, renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useVirtualizedList } from "./useVirtualizedList";

function items(count: number) {
  return Array.from({ length: count }, (_, i) => i);
}

describe("useVirtualizedList", () => {
  it("returns every item unvirtualized below the threshold", () => {
    const { result } = renderHook(() =>
      useVirtualizedList(items(50), { rowHeight: 40, containerHeight: 400, threshold: 200 })
    );

    expect(result.current.visibleItems).toEqual(items(50));
    expect(result.current.startIndex).toBe(0);
    expect(result.current.totalHeight).toBe(50 * 40);
  });

  it("windows the list at rest (scrollTop 0) once past the threshold", () => {
    const { result } = renderHook(() =>
      useVirtualizedList(items(1000), {
        rowHeight: 40,
        containerHeight: 400,
        overscan: 2,
        threshold: 200,
      })
    );

    // 400 / 40 = 10 visible rows, + 2 overscan below (none above, at the top)
    expect(result.current.startIndex).toBe(0);
    expect(result.current.visibleItems.length).toBeLessThan(1000);
    expect(result.current.visibleItems[0]).toBe(0);
    expect(result.current.totalHeight).toBe(1000 * 40);
    expect(result.current.offsetY).toBe(0);
  });

  it("shifts the visible window and offsetY when scrolled", () => {
    const { result } = renderHook(() =>
      useVirtualizedList(items(1000), {
        rowHeight: 40,
        containerHeight: 400,
        overscan: 2,
        threshold: 200,
      })
    );

    act(() => {
      result.current.onScroll({ currentTarget: { scrollTop: 2000 } });
    });

    // scrollTop 2000 / rowHeight 40 = row 50, minus 2 overscan = 48
    expect(result.current.startIndex).toBe(48);
    expect(result.current.offsetY).toBe(48 * 40);
    expect(result.current.visibleItems[0]).toBe(48);
  });

  it("never renders more DOM rows than a small overscan window, regardless of list length", () => {
    const { result } = renderHook(() =>
      useVirtualizedList(items(50_000), {
        rowHeight: 40,
        containerHeight: 400,
        overscan: 5,
        threshold: 200,
      })
    );

    // visibleCount (10) + overscan*2 (10) = 20 max, well under the full list.
    expect(result.current.visibleItems.length).toBeLessThanOrEqual(20);
  });

  it("clamps the window at the end of the list without going out of bounds", () => {
    const { result } = renderHook(() =>
      useVirtualizedList(items(300), {
        rowHeight: 40,
        containerHeight: 400,
        overscan: 5,
        threshold: 200,
      })
    );

    act(() => {
      // Scroll well past the end.
      result.current.onScroll({ currentTarget: { scrollTop: 100_000 } });
    });

    expect(result.current.visibleItems[result.current.visibleItems.length - 1]).toBe(299);
    expect(result.current.visibleItems.length).toBeGreaterThan(0);
  });
});

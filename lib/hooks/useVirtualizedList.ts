"use client";

import { useMemo, useState } from "react";

export interface UseVirtualizedListOptions {
  /** Fixed height of one row, in pixels. */
  rowHeight: number;
  /** Height of the scrollable viewport, in pixels. */
  containerHeight: number;
  /** Extra rows rendered above/below the visible window, to reduce blank
   * flashes on fast scrolling. */
  overscan?: number;
  /** Below this item count, virtualization is skipped entirely and every
   * item is returned as visible -- windowing a handful of rows only adds
   * scroll-math overhead for no benefit. */
  threshold?: number;
}

export interface UseVirtualizedListResult<T> {
  /** The subset of `items` that should actually be rendered. */
  visibleItems: T[];
  /** Index of `visibleItems[0]` within the original `items` array. */
  startIndex: number;
  /** Total scrollable height, in pixels, for the outer scroll container. */
  totalHeight: number;
  /** Top offset, in pixels, at which `visibleItems` should be positioned
   * (e.g. via `transform: translateY(offsetY)`), so the rendered subset
   * lands at its real scroll position instead of stacking at the top. */
  offsetY: number;
  /** Attach to the scroll container's `onScroll`. */
  onScroll: (event: { currentTarget: { scrollTop: number } }) => void;
}

const DEFAULT_OVERSCAN = 5;
const DEFAULT_THRESHOLD = 200;

/**
 * Windowed rendering for a long, fixed-row-height list: only the rows
 * within (and just outside) the visible scroll viewport are ever mounted,
 * instead of every row in `items` -- the DOM node count stays roughly
 * constant regardless of list length.
 *
 * Dependency-free (no react-window/react-virtual): this app's lists have a
 * single known row height, which is the simple case a small hook covers
 * without pulling in a general-purpose virtualization library.
 */
export function useVirtualizedList<T>(
  items: T[],
  { rowHeight, containerHeight, overscan = DEFAULT_OVERSCAN, threshold = DEFAULT_THRESHOLD }: UseVirtualizedListOptions
): UseVirtualizedListResult<T> {
  const [scrollTop, setScrollTop] = useState(0);

  return useMemo(() => {
    if (items.length < threshold) {
      return {
        visibleItems: items,
        startIndex: 0,
        totalHeight: items.length * rowHeight,
        offsetY: 0,
        onScroll: () => {},
      };
    }

    const totalHeight = items.length * rowHeight;
    const visibleCount = Math.ceil(containerHeight / rowHeight);

    const rawStart = Math.floor(scrollTop / rowHeight) - overscan;
    // Clamp against the end of the list too, not just the start -- a
    // scrollTop beyond the scrollable area (e.g. from a stale/oversized
    // value) must not push startIndex past what the list can actually
    // supply, which would otherwise slice to an empty result.
    const maxStartIndex = Math.max(0, items.length - visibleCount);
    const startIndex = Math.min(Math.max(0, rawStart), maxStartIndex);
    const endIndex = Math.min(items.length, startIndex + visibleCount + overscan * 2);

    return {
      visibleItems: items.slice(startIndex, endIndex),
      startIndex,
      totalHeight,
      offsetY: startIndex * rowHeight,
      onScroll: (event: { currentTarget: { scrollTop: number } }) =>
        setScrollTop(event.currentTarget.scrollTop),
    };
  }, [items, rowHeight, containerHeight, overscan, threshold, scrollTop]);
}

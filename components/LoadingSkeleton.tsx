"use client";

import { useEffect, useState } from "react";

const SHIMMER_INTERVAL_MS = 700;
const SHIMMER_FRAMES = 3;

/** Route-level loading fallback (used from `loading.tsx` files). Cycles a
 * simple shimmer frame on an interval, cleaned up on unmount so navigating
 * away mid-load never tries to set state on an unmounted component. */
export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % SHIMMER_FRAMES);
    }, SHIMMER_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div role="status" aria-label="Loading" data-shimmer-frame={frame} className="loading-skeleton">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="loading-skeleton-row" />
      ))}
    </div>
  );
}

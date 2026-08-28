"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getInvoicePage, type Invoice, type InvoicePage } from "@/lib/qlx";

export interface UseInvoiceListResult {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  /** Warms the next page's cache (e.g. on hover over "Next"), so the
   * eventual `loadMore()` call resolves from cache instead of waiting on
   * a fresh round trip. Safe to call repeatedly -- a page already cached
   * or in flight is not re-requested. */
  prefetchNext: () => void;
}

/** Client-side cursor pagination over {@link getInvoicePage}. Each call to
 * `loadMore` appends the next page to the accumulated list rather than
 * replacing it, so the list never resets mid-scroll. */
export function useInvoiceList(userId: string, pageSize = 10): UseInvoiceListResult {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  // `undefined` means "first page not yet requested" -- distinct from `null`,
  // which is a real cursor value meaning "no more pages".
  const [fetchCursor, setFetchCursor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Cursor -> in-flight/resolved page, populated by `prefetchNext`. Consumed
  // (and evicted) by the main effect so a prefetched page is used at most once.
  const pageCache = useRef(new Map<string, Promise<InvoicePage>>());

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const cached = fetchCursor ? pageCache.current.get(fetchCursor) : undefined;
    const request =
      cached ?? getInvoicePage(userId, { cursor: fetchCursor ?? null, limit: pageSize });
    if (fetchCursor) pageCache.current.delete(fetchCursor);

    request
      .then((page) => {
        if (cancelled) return;
        setInvoices((current) => (fetchCursor ? [...current, ...page.invoices] : page.invoices));
        setNextCursor(page.nextCursor);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "failed to load invoices");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, fetchCursor, pageSize]);

  const prefetchNext = useCallback(() => {
    if (nextCursor === null || pageCache.current.has(nextCursor)) return;
    pageCache.current.set(nextCursor, getInvoicePage(userId, { cursor: nextCursor, limit: pageSize }));
  }, [userId, nextCursor, pageSize]);

  return {
    invoices,
    loading,
    error,
    hasMore: nextCursor !== null,
    loadMore: () => {
      if (nextCursor !== null && !loading) setFetchCursor(nextCursor);
    },
    prefetchNext,
  };
}

"use client";

import { useEffect, useState } from "react";
import { getInvoicePage, type Invoice } from "@/lib/qlx";

export interface UseInvoiceListResult {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
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

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getInvoicePage(userId, { cursor: fetchCursor ?? null, limit: pageSize })
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

  return {
    invoices,
    loading,
    error,
    hasMore: nextCursor !== null,
    loadMore: () => {
      if (nextCursor !== null && !loading) setFetchCursor(nextCursor);
    },
  };
}

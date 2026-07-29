"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/lib/generated/transactionsClient";
import type { Transaction } from "@/lib/transactions";

export interface UseTransactionsResult {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

/** Fetches transactions through the generated client instead of an ad-hoc
 * `fetch("/api/transactions")`, so the response shape -- including the
 * bigint <-> string amount conversion -- is typed and defined in one
 * place rather than re-parsed at every call site. */
export function useTransactions(): UseTransactionsResult {
  const [result, setResult] = useState<UseTransactionsResult>({
    transactions: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    getTransactions()
      .then((transactions) => {
        if (!cancelled) setResult({ transactions, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setResult({
            transactions: [],
            loading: false,
            error: err instanceof Error ? err.message : "failed to load transactions",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return result;
}

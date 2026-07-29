"use client";

import { useEffect, useState } from "react";
import type { Transaction } from "@/lib/qlx";

export interface UseTransactionsResult {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

/** Wire shape of `Transaction`: `amountStroops` travels as a decimal string
 * since `JSON` has no bigint type, parsed back with `BigInt(...)` here
 * rather than `Number(...)` to avoid precision loss. */
type TransactionWire = Omit<Transaction, "amountStroops"> & { amountStroops: string };

/** Fetches `/api/transactions?invoiceId=...` and exposes it as typed
 * state -- the typed client for transaction data, replacing any ad-hoc
 * `fetch` a component would otherwise write inline. */
export function useTransactions(invoiceId: string): UseTransactionsResult {
  const [result, setResult] = useState<UseTransactionsResult>({
    transactions: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/transactions?invoiceId=${encodeURIComponent(invoiceId)}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`transactions request failed with status ${res.status}`);
        }
        const body = (await res.json()) as { transactions: TransactionWire[] };
        if (!cancelled) {
          const transactions = body.transactions.map((txn) => ({
            ...txn,
            amountStroops: BigInt(txn.amountStroops),
          }));
          setResult({ transactions, loading: false, error: null });
        }
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
  }, [invoiceId]);

  return result;
}

"use client";

import { useMemo, useState } from "react";
import type { Transaction } from "@/lib/transactions";

export interface TransactionsTableProps {
  transactions: Transaction[];
}

type SortKey = "createdAt" | "amountStroops";
type SortDirection = "asc" | "desc";
type TypeFilter = "all" | Transaction["type"];

function formatAmount(amountStroops: bigint): string {
  // 1 XLM = 10_000_000 stroops.
  return (Number(amountStroops) / 10_000_000).toFixed(2);
}

/**
 * Sortable, filterable transaction table.
 *
 * Sort state (`sortKey`/`sortDirection`) and filter state (`typeFilter`)
 * are two independent `useState` calls, deliberately not coupled to each
 * other -- changing the filter must never reset the sort a user already
 * chose. (The bug this guards against: deriving the visible rows in a way
 * that re-keys or re-initializes the sort state whenever the filtered set
 * changes, e.g. a `key={typeFilter}` on the table or a `useEffect` that
 * resets `sortKey` when `typeFilter` changes.)
 */
export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return sortDirection === "asc" ? "ascending" : "descending";
  }

  const rows = useMemo(() => {
    const filtered =
      typeFilter === "all" ? transactions : transactions.filter((t) => t.type === typeFilter);

    const sorted = [...filtered].sort((a, b) => {
      const cmp =
        sortKey === "createdAt"
          ? a.createdAt.localeCompare(b.createdAt)
          : a.amountStroops < b.amountStroops
            ? -1
            : a.amountStroops > b.amountStroops
              ? 1
              : 0;
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [transactions, typeFilter, sortKey, sortDirection]);

  return (
    <div>
      <label>
        Type
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
        >
          <option value="all">All</option>
          <option value="fund">Fund</option>
          <option value="repayment">Repayment</option>
        </select>
      </label>
      <table>
        <thead>
          <tr>
            <th aria-sort={ariaSortFor("createdAt")}>
              <button type="button" onClick={() => toggleSort("createdAt")}>
                Date{sortKey === "createdAt" ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
              </button>
            </th>
            <th>Type</th>
            <th aria-sort={ariaSortFor("amountStroops")}>
              <button type="button" onClick={() => toggleSort("amountStroops")}>
                Amount (XLM)
                {sortKey === "amountStroops" ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((txn) => (
            <tr key={txn.id}>
              <td>{txn.createdAt}</td>
              <td>{txn.type}</td>
              <td>{formatAmount(txn.amountStroops)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

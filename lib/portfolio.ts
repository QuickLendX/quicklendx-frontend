import type { PortfolioRow } from "@/app/(app)/portfolio/PortfolioView";

/** Sorts portfolio rows highest-risk-first. Pure and allocation-only (never
 * mutates `rows`), so it's safe to call from a `useMemo` and skip on
 * re-renders where the input array reference hasn't changed. Ties break on
 * invoice id for a stable, deterministic order. */
export function sortRowsByRisk(rows: readonly PortfolioRow[]): PortfolioRow[] {
  return [...rows].sort((a, b) => {
    const riskDiff = b.detail.riskScore - a.detail.riskScore;
    if (riskDiff !== 0) return riskDiff;
    return a.invoice.id.localeCompare(b.invoice.id);
  });
}

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { TransactionsTable } from "./TransactionsTable";
import type { Transaction } from "@/lib/transactions";

const TRANSACTIONS: Transaction[] = [
  { id: "txn_1", invoiceId: "inv_1", type: "fund", amountStroops: 300_0000000n, createdAt: "2026-07-01T00:00:00.000Z" },
  { id: "txn_2", invoiceId: "inv_2", type: "repayment", amountStroops: 100_0000000n, createdAt: "2026-07-05T00:00:00.000Z" },
  { id: "txn_3", invoiceId: "inv_3", type: "fund", amountStroops: 200_0000000n, createdAt: "2026-07-03T00:00:00.000Z" },
];

function rowIds() {
  return screen.getAllByRole("row").slice(1).map((row) => within(row).getAllByRole("cell")[0].textContent);
}

describe("TransactionsTable", () => {
  it("sorts by date descending by default", () => {
    render(<TransactionsTable transactions={TRANSACTIONS} />);
    expect(rowIds()).toEqual([
      "2026-07-05T00:00:00.000Z",
      "2026-07-03T00:00:00.000Z",
      "2026-07-01T00:00:00.000Z",
    ]);
  });

  it("toggles sort direction on repeated header clicks", async () => {
    const user = userEvent.setup();
    render(<TransactionsTable transactions={TRANSACTIONS} />);

    await user.click(screen.getByRole("button", { name: /Date/ }));

    expect(rowIds()).toEqual([
      "2026-07-01T00:00:00.000Z",
      "2026-07-03T00:00:00.000Z",
      "2026-07-05T00:00:00.000Z",
    ]);
  });

  it("filters by transaction type", async () => {
    const user = userEvent.setup();
    render(<TransactionsTable transactions={TRANSACTIONS} />);

    await user.selectOptions(screen.getByLabelText("Type"), "repayment");

    expect(screen.getAllByRole("row")).toHaveLength(2); // header + 1 data row
  });

  it("does not reset sort direction/column when the filter changes (#116)", async () => {
    const user = userEvent.setup();
    render(<TransactionsTable transactions={TRANSACTIONS} />);

    // Sort by amount ascending.
    await user.click(screen.getByRole("button", { name: /Amount/ }));
    expect(rowIds()).toEqual([
      "2026-07-05T00:00:00.000Z", // 100
      "2026-07-03T00:00:00.000Z", // 200
      "2026-07-01T00:00:00.000Z", // 300
    ]);

    // Change the filter to "fund" -- only txn_1 (300) and txn_3 (200) match.
    await user.selectOptions(screen.getByLabelText("Type"), "fund");

    // If sort had reset, this would fall back to the date-descending
    // default (txn_1 before txn_3). It must still be amount-ascending.
    expect(rowIds()).toEqual(["2026-07-03T00:00:00.000Z", "2026-07-01T00:00:00.000Z"]);

    // And the header still reflects the active sort.
    expect(screen.getByRole("columnheader", { name: /Amount/ })).toHaveAttribute(
      "aria-sort",
      "ascending"
    );
  });
});

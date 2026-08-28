import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { InvoiceFundStep } from "./InvoiceFundStep";

const push = vi.fn();
const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace }),
}));

describe("InvoiceFundStep", () => {
  it("pushes the confirm route so the detail step stays in browser history (#133)", async () => {
    const user = userEvent.setup();
    render(<InvoiceFundStep invoiceId="inv_1" />);

    await user.click(screen.getByRole("button", { name: "Continue to confirm" }));

    // Regression guard: using `replace` here would drop this step from
    // history, so pressing back from the confirm step would skip it.
    expect(push).toHaveBeenCalledWith("/dashboard/inv_1/confirm");
    expect(replace).not.toHaveBeenCalled();
  });

  it("gives the primary button hover/focus parity: both are reachable and keep the same accessible name", async () => {
    const user = userEvent.setup();
    render(<InvoiceFundStep invoiceId="inv_1" />);

    const button = screen.getByRole("button", { name: "Continue to confirm" });
    expect(button.className).toContain("btn-primary");

    await user.hover(button);
    expect(button).toHaveAccessibleName("Continue to confirm");

    await user.tab();
    expect(button).toHaveFocus();
    expect(button).toHaveAccessibleName("Continue to confirm");
  });
});

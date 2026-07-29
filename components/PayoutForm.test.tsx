import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PayoutForm } from "./PayoutForm";

const VALID_KEY = `G${"A".repeat(55)}`;

describe("PayoutForm", () => {
  it("calls onSubmit with a valid Stellar address", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PayoutForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Payout address"), VALID_KEY);
    await user.click(screen.getByRole("button", { name: "Send payout" }));

    expect(onSubmit).toHaveBeenCalledWith(VALID_KEY);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("rejects a non-Stellar address and does not call onSubmit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PayoutForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText("Payout address"),
      "0x71C7656EC7ab88b098defB751B7401B5f6d8976"
    );
    await user.click(screen.getByRole("button", { name: "Send payout" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid Stellar public key (56 characters, starting with G)."
    );
  });

  it("clears a previous error once a valid address is submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PayoutForm onSubmit={onSubmit} />);

    const input = screen.getByLabelText("Payout address");
    await user.type(input, "not-a-stellar-address");
    await user.click(screen.getByRole("button", { name: "Send payout" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, VALID_KEY);
    await user.click(screen.getByRole("button", { name: "Send payout" }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith(VALID_KEY);
  });
});

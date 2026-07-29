import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { SettingsPanel } from "./SettingsPanel";

describe("SettingsPanel", () => {
  it("defaults email notifications on and compact view off", () => {
    render(<SettingsPanel />);

    expect(screen.getByLabelText("Email notifications")).toBeChecked();
    expect(screen.getByLabelText("Compact view")).not.toBeChecked();
  });

  it("toggles each setting independently", async () => {
    const user = userEvent.setup();
    render(<SettingsPanel />);

    await user.click(screen.getByLabelText("Email notifications"));
    await user.click(screen.getByLabelText("Compact view"));

    expect(screen.getByLabelText("Email notifications")).not.toBeChecked();
    expect(screen.getByLabelText("Compact view")).toBeChecked();
  });
});

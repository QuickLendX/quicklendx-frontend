import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { useEffect } from "react";
import { ToastProvider, useToast } from "./ToastProvider";

afterEach(() => {
  vi.restoreAllMocks();
});

function ShowOnMount({ message }: { message: string }) {
  const { showToast } = useToast();
  useEffect(() => {
    showToast(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

describe("ToastProvider / useToast", () => {
  it("renders a shown toast and removes it when dismissed", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ShowOnMount message="Invoice funded" />
      </ToastProvider>
    );

    expect(screen.getByText("Invoice funded")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(screen.queryByText("Invoice funded")).not.toBeInTheDocument();
  });

  it("logs a structured breadcrumb on dismiss, without leaking the toast message", async () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ShowOnMount message="wallet secret should never appear in logs" />
      </ToastProvider>
    );

    await user.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const line = infoSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(line);
    expect(parsed).toMatchObject({ level: "info", event: "toast_dismissed", reason: "manual" });
    expect(typeof parsed.toastId).toBe("string");
    expect(line).not.toContain("wallet secret");
  });

  it("throws when rendered outside a ToastProvider", () => {
    function Consumer() {
      useToast();
      return null;
    }

    expect(() => render(<Consumer />)).toThrow("useToast must be used within a ToastProvider");
  });
});

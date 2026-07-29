import { describe, it, expect, vi, afterEach } from "vitest";
import { log } from "./logger";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("log", () => {
  it("emits a single-line JSON entry with the level, event, and fields", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    log("info", "toast_dismissed", { toastId: "toast_1", reason: "manual" });

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const line = infoSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(line);
    expect(parsed).toMatchObject({
      level: "info",
      event: "toast_dismissed",
      toastId: "toast_1",
      reason: "manual",
    });
    expect(typeof parsed.ts).toBe("string");
  });

  it("routes warn and error to their matching console methods", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    log("warn", "something_recoverable");
    log("error", "cannot_proceed");

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
});

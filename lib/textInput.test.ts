import { describe, it, expect } from "vitest";
import { parseTrimmedInput } from "./textInput";

describe("parseTrimmedInput", () => {
  it("trims leading and trailing whitespace", () => {
    expect(parseTrimmedInput("  Acme Textiles  ")).toEqual({
      ok: true,
      value: "Acme Textiles",
    });
  });

  it("trims tabs and newlines, not just spaces", () => {
    expect(parseTrimmedInput("\t\nAcme\n\t")).toEqual({ ok: true, value: "Acme" });
  });

  it("does not alter internal whitespace", () => {
    expect(parseTrimmedInput("  Acme   Textiles  ")).toEqual({
      ok: true,
      value: "Acme   Textiles",
    });
  });

  it("passes an already-trimmed value through unchanged", () => {
    expect(parseTrimmedInput("Acme")).toEqual({ ok: true, value: "Acme" });
  });

  it("rejects an empty string", () => {
    expect(parseTrimmedInput("")).toEqual({ ok: false, error: "empty_after_trim" });
  });

  it("rejects a whitespace-only string", () => {
    expect(parseTrimmedInput("   \t\n  ")).toEqual({
      ok: false,
      error: "empty_after_trim",
    });
  });
});

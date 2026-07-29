import { describe, it, expect } from "vitest";
import {
  formatStroops,
  parseInvoiceAmount,
  parseCurrencyAmount,
  INVOICE_AMOUNT_MAX_STROOPS,
  STROOPS_PER_XLM,
} from "./money";

describe("formatStroops", () => {
  it("formats a whole XLM amount", () => {
    expect(formatStroops(STROOPS_PER_XLM)).toBe("1.0000000");
  });

  it("formats zero", () => {
    expect(formatStroops(0n)).toBe("0.0000000");
  });

  it("formats a fractional amount without losing precision", () => {
    expect(formatStroops(1n)).toBe("0.0000001");
  });

  it("formats a negative amount", () => {
    expect(formatStroops(-STROOPS_PER_XLM)).toBe("-1.0000000");
  });

  it("formats an amount far beyond Number.MAX_SAFE_INTEGER", () => {
    const huge = 10n ** 30n;
    const expectedWhole = (10n ** 30n / STROOPS_PER_XLM).toString();
    expect(formatStroops(huge)).toBe(`${expectedWhole}.0000000`);
  });
});

describe("parseInvoiceAmount", () => {
  it("parses a whole XLM amount", () => {
    expect(parseInvoiceAmount("12")).toEqual({ ok: true, amountStroops: 12n * STROOPS_PER_XLM });
  });

  it("parses a fractional amount", () => {
    expect(parseInvoiceAmount("0.5")).toEqual({ ok: true, amountStroops: STROOPS_PER_XLM / 2n });
  });

  it("accepts an amount exactly at the i128 max", () => {
    expect(parseInvoiceAmount(formatStroops(INVOICE_AMOUNT_MAX_STROOPS))).toEqual({
      ok: true,
      amountStroops: INVOICE_AMOUNT_MAX_STROOPS,
    });
  });

  it("rejects an amount one stroop past the i128 max", () => {
    const result = parseInvoiceAmount(formatStroops(INVOICE_AMOUNT_MAX_STROOPS + 1n));
    expect(result.ok).toBe(false);
  });

  it("rejects non-numeric input", () => {
    const result = parseInvoiceAmount("not a number");
    expect(result.ok).toBe(false);
  });

  it("rejects a negative amount", () => {
    const result = parseInvoiceAmount("-5");
    expect(result.ok).toBe(false);
  });
});

describe("parseCurrencyAmount", () => {
  it("accepts a whole amount", () => {
    expect(parseCurrencyAmount("100")).toEqual({ ok: true, value: "100" });
  });

  it("accepts exactly 2 decimal places", () => {
    expect(parseCurrencyAmount(" 12.34 ")).toEqual({ ok: true, value: "12.34" });
  });

  it("rejects more than 2 decimal places", () => {
    const result = parseCurrencyAmount("12.345");
    expect(result.ok).toBe(false);
  });

  it("rejects non-numeric input", () => {
    const result = parseCurrencyAmount("abc");
    expect(result.ok).toBe(false);
  });
});

import { describe, it, expect } from "vitest";
import { validateIban } from "./iban";

describe("validateIban", () => {
  it("accepts a known-valid IBAN", () => {
    expect(validateIban("DE89370400440532013000")).toEqual({ ok: true, error: null });
  });

  it("accepts the same IBAN with spaces and lowercase, ignoring both", () => {
    expect(validateIban("de89 3704 0044 0532 0130 00")).toEqual({ ok: true, error: null });
  });

  it("rejects an IBAN with a bad checksum (one digit changed)", () => {
    const result = validateIban("DE89370400440532013001");
    expect(result.ok).toBe(false);
    expect(result.error).toContain("check digits");
  });

  it("rejects a string that isn't IBAN-shaped", () => {
    const result = validateIban("not an iban");
    expect(result.ok).toBe(false);
    expect(result.error).toContain("valid IBAN");
  });

  it("rejects an empty string", () => {
    expect(validateIban("").ok).toBe(false);
  });

  it("rejects a too-short value that otherwise matches the country+check-digit prefix", () => {
    expect(validateIban("DE89370400").ok).toBe(false);
  });
});

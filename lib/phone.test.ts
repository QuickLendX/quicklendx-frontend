import { describe, it, expect } from "vitest";
import { validatePhoneNumber } from "./phone";

describe("validatePhoneNumber", () => {
  it("accepts a valid international number and normalizes it to E.164", () => {
    expect(validatePhoneNumber("+1 202-555-0173")).toEqual({
      ok: true,
      e164: "+12025550173",
    });
  });

  it("accepts a valid national number given a default country", () => {
    expect(validatePhoneNumber("202-555-0173", "US")).toEqual({
      ok: true,
      e164: "+12025550173",
    });
  });

  it("rejects a number with too few digits for its country", () => {
    expect(validatePhoneNumber("+1 555", "US")).toEqual({
      ok: false,
      error: "invalid_phone_number",
    });
  });

  it("rejects a number with an unassigned/invalid country calling code", () => {
    expect(validatePhoneNumber("+0000000000")).toEqual({
      ok: false,
      error: "invalid_phone_number",
    });
  });

  it("rejects a non-numeric string", () => {
    expect(validatePhoneNumber("not-a-phone-number")).toEqual({
      ok: false,
      error: "invalid_phone_number",
    });
  });

  it("rejects an empty string", () => {
    expect(validatePhoneNumber("")).toEqual({ ok: false, error: "invalid_phone_number" });
  });

  it("accepts a valid number from a non-US region", () => {
    // UK: a real, valid mobile number pattern.
    expect(validatePhoneNumber("+44 7911 123456")).toEqual({
      ok: true,
      e164: "+447911123456",
    });
  });
});

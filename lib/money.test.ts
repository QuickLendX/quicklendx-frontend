import { describe, it, expect } from "vitest";
import { formatStroops, STROOPS_PER_XLM } from "./money";

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

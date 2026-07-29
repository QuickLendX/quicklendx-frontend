import { describe, it, expect } from "vitest";
import { parseProfileForm } from "./profileSchema";

describe("parseProfileForm", () => {
  it("accepts valid input, trimming surrounding whitespace", () => {
    const result = parseProfileForm({ displayName: "  Ada Lovelace  ", email: " ada@example.com " });

    expect(result).toEqual({
      ok: true,
      values: { displayName: "Ada Lovelace", email: "ada@example.com" },
    });
  });

  it("rejects an empty display name", () => {
    const result = parseProfileForm({ displayName: "", email: "ada@example.com" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.displayName).toBe("Display name is required");
  });

  it("rejects a malformed email", () => {
    const result = parseProfileForm({ displayName: "Ada Lovelace", email: "not-an-email" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toBe("Enter a valid email address");
  });

  it("rejects a display name over 80 characters", () => {
    const result = parseProfileForm({ displayName: "a".repeat(81), email: "ada@example.com" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.displayName).toBe("Display name must be 80 characters or fewer");
  });

  it("reports one error per field, not just the first failure", () => {
    const result = parseProfileForm({ displayName: "", email: "not-an-email" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.displayName).toBeDefined();
      expect(result.errors.email).toBeDefined();
    }
  });
});

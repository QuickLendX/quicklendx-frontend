import { describe, it, expect } from "vitest";
import { isValidStellarPublicKey } from "./stellar";

const VALID_KEY = `G${"A".repeat(55)}`;

describe("isValidStellarPublicKey", () => {
  it("accepts a well-formed Stellar public key", () => {
    expect(isValidStellarPublicKey(VALID_KEY)).toBe(true);
  });

  it("rejects an Ethereum-style 0x address", () => {
    expect(isValidStellarPublicKey("0x71C7656EC7ab88b098defB751B7401B5f6d8976")).toBe(false);
  });

  it("rejects a key that is too short", () => {
    expect(isValidStellarPublicKey(VALID_KEY.slice(0, -1))).toBe(false);
  });

  it("rejects a key that is too long", () => {
    expect(isValidStellarPublicKey(`${VALID_KEY}A`)).toBe(false);
  });

  it("rejects a key with the wrong version byte", () => {
    expect(isValidStellarPublicKey(`M${VALID_KEY.slice(1)}`)).toBe(false);
  });

  it("rejects a key containing characters outside the base32 alphabet", () => {
    expect(isValidStellarPublicKey(`${VALID_KEY.slice(0, -1)}1`)).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidStellarPublicKey("")).toBe(false);
  });
});

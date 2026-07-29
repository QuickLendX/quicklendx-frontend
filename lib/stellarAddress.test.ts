import { describe, it, expect } from "vitest";
import { isValidStellarAddress } from "./stellarAddress";

const VALID_ADDRESS = "GABQUEIYD4TC2NB3IJEVAV26MVWHG6UBRCHZNHNEVOZLTQGHZ3K5YMUR";
const ANOTHER_VALID_ADDRESS = "GAAQ4GZIGVBE6XDJO2BZBHNKW7CNDXXL7ACREHZMHFDFGYDNPKDZJ25R";
// Same as VALID_ADDRESS with the final character swapped -- correct length
// and prefix, but the checksum no longer matches.
const CHECKSUM_TAMPERED_ADDRESS = "GABQUEIYD4TC2NB3IJEVAV26MVWHG6UBRCHZNHNEVOZLTQGHZ3K5YMUA";

describe("isValidStellarAddress", () => {
  it("accepts a well-formed, checksum-valid address", () => {
    expect(isValidStellarAddress(VALID_ADDRESS)).toBe(true);
    expect(isValidStellarAddress(ANOTHER_VALID_ADDRESS)).toBe(true);
  });

  it("rejects an address with a tampered checksum despite correct format", () => {
    // Proves this is a real checksum check, not just a prefix/length
    // check: this string has the right prefix and length but one
    // character was changed, so the payload no longer matches its checksum.
    expect(isValidStellarAddress(CHECKSUM_TAMPERED_ADDRESS)).toBe(false);
  });

  it("rejects a value that doesn't start with G", () => {
    expect(isValidStellarAddress("A" + VALID_ADDRESS.slice(1))).toBe(false);
  });

  it("rejects a value with the wrong length", () => {
    expect(isValidStellarAddress(VALID_ADDRESS.slice(0, -1))).toBe(false);
    expect(isValidStellarAddress(VALID_ADDRESS + "A")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidStellarAddress("")).toBe(false);
  });

  it("rejects a value with characters outside the base32 alphabet", () => {
    expect(isValidStellarAddress("G0" + VALID_ADDRESS.slice(2))).toBe(false);
  });

  it("rejects an Ethereum-style address", () => {
    expect(isValidStellarAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976")).toBe(false);
  });
});

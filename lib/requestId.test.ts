import { describe, it, expect, vi, afterEach } from "vitest";
import { newRequestId } from "./requestId";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("newRequestId", () => {
  it("returns a UUID-shaped string when crypto.randomUUID is available", () => {
    const id = newRequestId();
    expect(id).toMatch(/^[0-9a-f-]{36}$/i);
  });

  it("returns distinct ids across calls", () => {
    expect(newRequestId()).not.toBe(newRequestId());
  });

  it("falls back to a non-empty string when crypto.randomUUID is unavailable", () => {
    const original = crypto.randomUUID;
    // @ts-expect-error -- simulating an environment without randomUUID
    crypto.randomUUID = undefined;

    const id = newRequestId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);

    crypto.randomUUID = original;
  });
});

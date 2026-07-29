import { describe, it, expect } from "vitest";
import { resolveMockRoute } from "./mock-server.mjs";

describe("resolveMockRoute", () => {
  it("resolves the signed-out session by default", () => {
    expect(resolveMockRoute("/api/auth/session")).toEqual({
      status: 200,
      body: { user: null },
    });
  });

  it("resolves an empty alerts list", () => {
    expect(resolveMockRoute("/api/alerts")).toEqual({ status: 200, body: { alerts: [] } });
  });

  it("returns 404 for an unknown route", () => {
    expect(resolveMockRoute("/api/nope")).toEqual({
      status: 404,
      body: { error: "not found" },
    });
  });
});

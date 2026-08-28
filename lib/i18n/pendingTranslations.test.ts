import { describe, it, expect } from "vitest";
import { getPendingTranslations, getAllPendingTranslations } from "./pendingTranslations";
import { en } from "./messages";

describe("getPendingTranslations", () => {
  it("returns no pending keys for the default locale (en is the source of truth)", () => {
    expect(getPendingTranslations("en")).toEqual([]);
  });

  it("returns the keys missing from es's partial dictionary", () => {
    const pending = getPendingTranslations("es");

    // es only translates nav.dashboard / nav.portfolio today (see
    // messages.ts) -- everything else in `en` should show up as pending.
    expect(pending).toContain("dashboard.empty.title");
    expect(pending).toContain("portfolio.empty.description");
    expect(pending).not.toContain("nav.dashboard");
    expect(pending).not.toContain("nav.portfolio");
  });

  it("every pending key is a real key that exists in en", () => {
    const pending = getPendingTranslations("es");
    for (const key of pending) {
      expect(key in en).toBe(true);
    }
  });
});

describe("getAllPendingTranslations", () => {
  it("covers every locale except the default", () => {
    const result = getAllPendingTranslations();
    expect(result.map((r) => r.locale)).toEqual(["es"]);
  });

  it("matches getPendingTranslations for each locale it covers", () => {
    const [esResult] = getAllPendingTranslations();
    expect(esResult.keys).toEqual(getPendingTranslations("es"));
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getStoredLocale, setLocalePreference } from "./localePreference";

describe("localePreference", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("getStoredLocale returns null when nothing is set", () => {
    expect(getStoredLocale()).toBeNull();
  });

  it("getStoredLocale ignores an invalid stored value", () => {
    window.localStorage.setItem("qlx.locale", "fr");
    expect(getStoredLocale()).toBeNull();
  });

  it("setLocalePreference persists the new locale", () => {
    setLocalePreference("es");
    expect(getStoredLocale()).toBe("es");
  });

  it("logs a structured breadcrumb with the from/to locale on switch", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    setLocalePreference("es");

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const logged = JSON.parse(infoSpy.mock.calls[0][0] as string) as {
      level: string;
      event: string;
      from: string;
      to: string;
    };
    expect(logged.level).toBe("info");
    expect(logged.event).toBe("locale_switched");
    expect(logged.from).toBe("en");
    expect(logged.to).toBe("es");
  });

  it("does not log when the locale is unchanged", () => {
    setLocalePreference("es");
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    setLocalePreference("es");

    expect(infoSpy).not.toHaveBeenCalled();
  });
});

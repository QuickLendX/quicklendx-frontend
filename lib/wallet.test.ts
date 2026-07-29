import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { requestAccess } from "@stellar/freighter-api";
import { connectWallet } from "./wallet";

vi.mock("@stellar/freighter-api", () => ({
  requestAccess: vi.fn(),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe("connectWallet", () => {
  beforeEach(() => {
    vi.mocked(requestAccess).mockReset();
  });

  it("returns the public key on success, without logging anything", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(requestAccess).mockResolvedValue({ address: "GABC123" });

    const result = await connectWallet();

    expect(result).toEqual({ publicKey: "GABC123", error: null });
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("logs a structured warning with the extension context on failure", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(requestAccess).mockResolvedValue({
      address: "",
      error: { code: 4, message: "User declined access", ext: ["freighter@5.2.1"] },
    });

    const result = await connectWallet();

    expect(result).toEqual({ publicKey: null, error: "User declined access" });
    expect(warnSpy).toHaveBeenCalledTimes(1);

    const line = warnSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(line);
    expect(parsed).toMatchObject({
      level: "warn",
      event: "wallet_connect_failed",
      code: 4,
      message: "User declined access",
      extensionContext: "freighter@5.2.1",
    });
  });

  it("logs a null extension context when Freighter doesn't provide one", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(requestAccess).mockResolvedValue({
      address: "",
      error: { code: -1, message: "Freighter is not installed" },
    });

    const result = await connectWallet();

    expect(result.error).toBe("Freighter is not installed");
    const parsed = JSON.parse(warnSpy.mock.calls[0][0] as string);
    expect(parsed.extensionContext).toBeNull();
  });
});

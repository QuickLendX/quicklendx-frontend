import { requestAccess } from "@stellar/freighter-api";
import { log } from "@/lib/logger";

export interface ConnectWalletResult {
  publicKey: string | null;
  error: string | null;
}

/** Requests access to the user's Freighter wallet via `@stellar/freighter-api`
 * (never read `window.freighter` directly). On failure, logs a structured
 * breadcrumb including Freighter's `ext` field -- diagnostic context such as
 * the installed extension version -- so wallet-connect failures are
 * debuggable from aggregated logs without needing the user's own console. */
export async function connectWallet(): Promise<ConnectWalletResult> {
  const result = await requestAccess();

  if (result.error) {
    log("warn", "wallet_connect_failed", {
      code: result.error.code,
      message: result.error.message,
      extensionContext: result.error.ext?.join(",") ?? null,
    });
    return { publicKey: null, error: result.error.message };
  }

  return { publicKey: result.address, error: null };
}

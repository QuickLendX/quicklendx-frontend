import { http, HttpResponse } from "msw";
import type { SessionResponse } from "@/lib/auth";

const SIGNED_OUT: SessionResponse = { user: null };

const SIGNED_IN: SessionResponse = {
  user: { publicKey: "GABCDEXAMPLESTELLARPUBLICKEY000000000000000000000000000" },
};

/** Default handlers for the auth endpoints, used by every test unless a
 * specific test overrides one with `server.use(...)`. Defaults to
 * signed-out, matching the route handler's real default. */
export const authHandlers = [
  http.get("/api/auth/session", () => HttpResponse.json(SIGNED_OUT)),
];

/** Convenience override for tests that need a signed-in session:
 * `server.use(...signedInSessionHandlers)`. */
export const signedInSessionHandlers = [
  http.get("/api/auth/session", () => HttpResponse.json(SIGNED_IN)),
];

export const handlers = [...authHandlers];

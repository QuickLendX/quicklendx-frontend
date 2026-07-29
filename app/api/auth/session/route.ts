import { NextResponse } from "next/server";

/** No real session store exists yet (auth lands with real wallet-based
 * login later) -- this always reports "signed out" so callers have a real
 * endpoint to hit and a stable contract to build against. */
export async function GET() {
  return NextResponse.json({ user: null });
}

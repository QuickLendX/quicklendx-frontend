import { NextResponse } from "next/server";

/** Revokes a credential by opaque id. Mocked until the real credential
 * store is wired up -- always succeeds for a non-empty `credentialId`, so
 * the client hook has a real endpoint contract to build and test against. */
export async function POST(request: Request) {
  const body = (await request.json()) as { credentialId?: string };

  if (!body.credentialId) {
    return NextResponse.json({ error: "credentialId is required" }, { status: 400 });
  }

  return NextResponse.json({ revoked: true, credentialId: body.credentialId });
}

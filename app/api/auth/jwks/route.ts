import { NextResponse } from "next/server";
import type { Jwks } from "@/lib/auth/jwks";

// TODO: replace with the real signing keys once JWT-based sessions are
// issued server-side. Mocked for now so the client-side caching layer
// (lib/auth/jwks.ts) has a real endpoint to cache against.
const MOCK_JWKS: Jwks = {
  keys: [{ kid: "mock-key-1", kty: "RSA", n: "mock-modulus", e: "AQAB" }],
};

export async function GET() {
  return NextResponse.json(MOCK_JWKS);
}

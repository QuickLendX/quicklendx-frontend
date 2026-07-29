import { NextResponse } from "next/server";
import type { HealthDeep } from "@/lib/health";

// TODO: replace with real upstream checks (RPC node, indexer) once those
// dependencies exist. Mocked as all-healthy for now so the client-side hook
// has a real endpoint and stable contract to build against.
export async function GET() {
  const body: HealthDeep = {
    status: "ok",
    checks: [
      { name: "rpc", ok: true },
      { name: "indexer", ok: true },
    ],
    checkedAt: new Date().toISOString(),
  };

  return NextResponse.json(body);
}

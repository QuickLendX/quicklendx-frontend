#!/usr/bin/env node
import { createServer } from "node:http";

// Canned responses matching the shape of the real Next.js API routes under
// app/api/. Kept intentionally tiny: this is a local-dev convenience for
// working against the API surface without booting the full Next dev
// server, not a replacement for the MSW handlers used in tests.
export const MOCK_ROUTES = {
  "/api/auth/session": { user: null },
  "/api/alerts": { alerts: [] },
};

export function resolveMockRoute(pathname) {
  const body = MOCK_ROUTES[pathname];
  return body ? { status: 200, body } : { status: 404, body: { error: "not found" } };
}

export function createMockApiServer() {
  return createServer((req, res) => {
    const { status, body } = resolveMockRoute(req.url ?? "");
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
  });
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;

if (isMain) {
  const port = process.env.MOCK_API_PORT ? Number(process.env.MOCK_API_PORT) : 4000;
  createMockApiServer().listen(port, () => {
    console.log(`Mock API listening on http://localhost:${port}`);
    console.log(`Routes: ${Object.keys(MOCK_ROUTES).join(", ")}`);
  });
}

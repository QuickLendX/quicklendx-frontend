import { describe, it, expect } from "vitest";
import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://localhost/api/credentials/revoke", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/credentials/revoke", () => {
  it("revokes a credential given a non-empty id", async () => {
    const res = await POST(req({ credentialId: "cred_1" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ revoked: true, credentialId: "cred_1" });
  });

  it("rejects a missing credentialId with 400", async () => {
    const res = await POST(req({}));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "credentialId is required" });
  });
});

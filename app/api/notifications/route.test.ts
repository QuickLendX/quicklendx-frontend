import { describe, it, expect } from "vitest";
import { GET } from "./route";
import { MOCK_NOTIFICATIONS } from "@/lib/notifications";

describe("GET /api/notifications", () => {
  it("returns the mocked notifications list", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ notifications: MOCK_NOTIFICATIONS });
  });
});

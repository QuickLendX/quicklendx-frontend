import { describe, it, expect } from "vitest";
import { MAX_UPLOAD_BYTES, validateFileUpload } from "./fileUpload";

function fileOfSize(bytes: number): File {
  return { size: bytes, name: "document.pdf" } as File;
}

describe("validateFileUpload", () => {
  it("accepts a file at exactly the limit", () => {
    expect(validateFileUpload(fileOfSize(MAX_UPLOAD_BYTES))).toEqual({ ok: true, error: null });
  });

  it("accepts a small file", () => {
    expect(validateFileUpload(fileOfSize(1024))).toEqual({ ok: true, error: null });
  });

  it("rejects a file one byte over the limit", () => {
    const result = validateFileUpload(fileOfSize(MAX_UPLOAD_BYTES + 1));
    expect(result.ok).toBe(false);
    expect(result.error).toContain("25 MiB");
  });

  it("rejects a much larger file with a readable size in the message", () => {
    const result = validateFileUpload(fileOfSize(100 * 1024 * 1024));
    expect(result.ok).toBe(false);
    expect(result.error).toBe("File is 100.0 MiB, which exceeds the 25 MiB limit.");
  });
});

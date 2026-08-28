export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MiB

export interface FileUploadValidationResult {
  ok: boolean;
  error: string | null;
}

/**
 * Rejects a file over {@link MAX_UPLOAD_BYTES} before it's ever read into
 * memory or sent to the server -- client-side, so an oversized file (a
 * multi-gigabyte accidental drag-drop, for example) never gets fully
 * buffered just to be rejected. This is a UX/DoS-prevention guard, not a
 * substitute for the server enforcing its own limit on the actual request.
 */
export function validateFileUpload(file: File): FileUploadValidationResult {
  if (file.size > MAX_UPLOAD_BYTES) {
    const maxMiB = (MAX_UPLOAD_BYTES / (1024 * 1024)).toFixed(0);
    const actualMiB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      ok: false,
      error: `File is ${actualMiB} MiB, which exceeds the ${maxMiB} MiB limit.`,
    };
  }
  return { ok: true, error: null };
}

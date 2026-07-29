export type LogLevel = "info" | "warn" | "error";

export type LogFields = Record<string, string | number | boolean | null | undefined>;

/**
 * Emits one structured, single-line JSON log entry -- never a free-form
 * string -- so lifecycle breadcrumbs are easy to grep/parse in aggregation
 * tools. Callers must not pass secrets, tokens, or full request bodies in
 * `fields`.
 *
 * Use "info" for lifecycle events, "warn" for recoverable issues, and
 * "error" only when the caller cannot proceed.
 */
export function log(level: LogLevel, event: string, fields: LogFields = {}): void {
  const entry = { level, event, ...fields, ts: new Date().toISOString() };
  const line = JSON.stringify(entry);

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}

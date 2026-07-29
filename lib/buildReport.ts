export interface ChunkSize {
  file: string;
  bytes: number;
}

/** Returns the `limit` largest chunks, largest first. Pure sort + slice so
 * the ranking logic can be unit-tested independently of reading the
 * filesystem (the CI step that gathers real `.next` output is the only
 * caller that touches disk). */
export function topChunksBySize(chunks: readonly ChunkSize[], limit = 5): ChunkSize[] {
  return [...chunks].sort((a, b) => b.bytes - a.bytes).slice(0, limit);
}

function formatKb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/** Renders a markdown table for a PR comment. Returns an explicit
 * "no chunks" line for an empty list rather than an empty/blank table. */
export function formatChunkSizesMarkdown(chunks: readonly ChunkSize[]): string {
  if (chunks.length === 0) return "No chunk output found.";

  const rows = chunks.map((c) => `| \`${c.file}\` | ${formatKb(c.bytes)} |`).join("\n");
  return `| Chunk | Size |\n| --- | --- |\n${rows}`;
}

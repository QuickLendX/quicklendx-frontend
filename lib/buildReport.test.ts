import { describe, it, expect } from "vitest";
import { topChunksBySize, formatChunkSizesMarkdown, type ChunkSize } from "./buildReport";

const CHUNKS: ChunkSize[] = [
  { file: "a.js", bytes: 1024 },
  { file: "b.js", bytes: 51_200 },
  { file: "c.js", bytes: 10_240 },
];

describe("topChunksBySize", () => {
  it("sorts largest first", () => {
    expect(topChunksBySize(CHUNKS).map((c) => c.file)).toEqual(["b.js", "c.js", "a.js"]);
  });

  it("limits to the given count", () => {
    expect(topChunksBySize(CHUNKS, 2)).toHaveLength(2);
  });

  it("does not mutate the input array", () => {
    const original = [...CHUNKS];
    topChunksBySize(CHUNKS);
    expect(CHUNKS).toEqual(original);
  });

  it("returns an empty array for empty input", () => {
    expect(topChunksBySize([])).toEqual([]);
  });
});

describe("formatChunkSizesMarkdown", () => {
  it("renders a markdown table with KB-formatted sizes", () => {
    const table = formatChunkSizesMarkdown([{ file: "b.js", bytes: 51_200 }]);
    expect(table).toBe("| Chunk | Size |\n| --- | --- |\n| `b.js` | 50.0 KB |");
  });

  it("returns an explicit message for an empty list", () => {
    expect(formatChunkSizesMarkdown([])).toBe("No chunk output found.");
  });
});

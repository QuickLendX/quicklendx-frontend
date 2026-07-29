#!/usr/bin/env node
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const CHUNKS_DIR = join(process.cwd(), ".next", "static", "chunks");
const TOP_N = 10;

function collectJsFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectJsFiles(full));
    else if (entry.name.endsWith(".js")) out.push(full);
  }
  return out;
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function main() {
  const largest = collectJsFiles(CHUNKS_DIR)
    .map((path) => ({ path: relative(process.cwd(), path), bytes: statSync(path).size }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, TOP_N);

  const rows = largest.map((f) => `| \`${f.path}\` | ${formatKb(f.bytes)} |`).join("\n");
  console.log(`## Largest client chunks\n\n| Chunk | Size |\n| --- | --- |\n${rows}`);
}

main();

import { rmSync } from "node:fs";

// Local, on-disk dev caches that can go stale across branch switches or
// dependency bumps -- clearing them is always safe to re-run since
// `force: true` makes a missing directory a no-op rather than an error.
const DIRS_TO_CLEAR = [".next"];

for (const dir of DIRS_TO_CLEAR) {
  rmSync(dir, { recursive: true, force: true });
  console.log(`[dev:reset] cleared ${dir}`);
}

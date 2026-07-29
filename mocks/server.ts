import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/** Node-side MSW server, started/stopped around the whole test run in
 * test/setup.ts. Import `server.use(...)` in an individual test to override
 * a handler for just that test. */
export const server = setupServer(...handlers);

# QuickLendX Frontend

Next.js 15 (App Router) + React 19 + TypeScript scaffold for the QuickLendX invoice-lending UI.

## Getting started

```bash
npm ci
npm run dev
# → http://localhost:3000
```

## Scripts

| Script            | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start the dev server                           |
| `npm run build`   | Production build                               |
| `npm run start`   | Serve the production build                     |
| `npm run lint`    | ESLint (Next.js core-web-vitals + TS presets)  |
| `npm run typecheck` | `tsc --noEmit`                               |
| `npm test`        | vitest + React Testing Library                 |

## Environment variables

Copy `.env.example` to `.env.local` and fill in values. All runtime env vars
are read through `lib/config.ts` — never access `process.env` directly in
business logic.

| Variable      | Required | Default | Description                                                                 |
| ------------- | -------- | ------- | --------------------------------------------------------------------------- |
| `SENTRY_DSN`  | No       | `""`    | Sentry DSN for error tracking. When empty, Sentry is disabled.              |

## Mock API server for local dev

`npm run mock:api` starts a standalone HTTP server (`scripts/mock-server.mjs`)
serving canned JSON for the same paths as the real API routes under
`app/api/` (`/api/auth/session`, `/api/alerts`), on
`http://localhost:4000` by default. Override the port with `MOCK_API_PORT`.

This is a one-command way to exercise the API surface (e.g. with `curl`, or
from another tool) without booting the full Next dev server. It's separate
from the [MSW handlers](#testing-auth-backed-code) used in tests -- those
intercept requests inside the test runner, they don't listen on a real port.

## Testing auth-backed code

`mocks/handlers.ts` holds [MSW](https://mswjs.io) request handlers for the
auth endpoints (`/api/auth/session` for now), started/stopped globally in
`test/setup.ts`. Any test that renders a component or hook calling those
endpoints gets the default (signed-out) response automatically — no manual
`fetch` mocking needed. To exercise a different response in one test, use
`server.use(...)`:

```ts
import { server } from "../../mocks/server";
import { signedInSessionHandlers } from "../../mocks/handlers";

server.use(...signedInSessionHandlers);
```

See `lib/hooks/useSession.test.ts` for the full pattern, including an
explicit-failure case via `server.use(http.get(..., () => new HttpResponse(...)))`.

## Layout

```
app/
  layout.tsx    # root layout
  page.tsx      # landing page
  globals.css   # design tokens (light + dark)
```

## Contributing

See the QuickLendX org for the contribution rules and the FWC26 campaign board. Every PR must reference the issue it closes with `Closes #<n>`.

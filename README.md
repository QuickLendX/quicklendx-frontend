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

## Layout

```
app/
  layout.tsx    # root layout
  page.tsx      # landing page
  globals.css   # design tokens (light + dark)
```

## Contributing

See the QuickLendX org for the contribution rules and the FWC26 campaign board. Every PR must reference the issue it closes with `Closes #<n>`.

# Client/server component boundary

Audience: contributors adding or reviewing a component in this app.

This is a Next.js App Router codebase. Every file under `app/` and
`components/` is a **Server Component by default** unless it starts with
the `"use client"` directive. Getting this wrong either ships server-only
code to the browser or loses the interactivity a component needs — so
the rule below is deliberate, not a style preference.

## The rule

Add `"use client"` only when a component needs one of:

- React state or effects (`useState`, `useEffect`, ...)
- A browser-only API (`localStorage`, `window`, event listeners)
- A React context provider or consumer (`createContext`, `useContext`)

Everything else — including `async` data fetching — stays a Server
Component with no directive at all.

## Real examples from this repo

**Server Component** — [`app/(app)/dashboard/page.tsx`](../app/(app)/dashboard/page.tsx)
fetches data with a top-level `await` and renders it. No directive, no
client-side JS shipped for this file:

```tsx
export default async function DashboardPage() {
  const invoices = await getInvoicesForUser(DEMO_USER_ID);
  return <DashboardView invoices={invoices} />;
}
```

**Presentational, framework-agnostic** — [`app/(app)/dashboard/DashboardView.tsx`](../app/(app)/dashboard/DashboardView.tsx)
takes plain props and renders markup with no hooks and no directive. It's
kept separate from `page.tsx` specifically so it can be unit-tested
without rendering a Server Component in tests (see its `.test.tsx` file).

**Client Component** — [`components/SidebarProvider.tsx`](../components/SidebarProvider.tsx)
owns `useState` and a context, so it must be `"use client"`:

```tsx
"use client";

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  // ...
}
```

[`components/Sidebar.tsx`](../components/Sidebar.tsx) is `"use client"` too,
because it consumes that context via `useSidebar()` — a component that
reads a client context must itself be a Client Component.

## Where the boundary usually falls in this app

| Layer                          | Typically              | Why                                   |
| ------------------------------ | ----------------------- | -------------------------------------- |
| `page.tsx` files                | Server Component        | Owns the `await` for data fetching     |
| `*View.tsx` presentational bodies | Server Component      | Pure props → markup, no interactivity  |
| Providers (context, state)     | Client Component (`"use client"`) | Needs `useState`/`useContext`  |
| Anything consuming a provider  | Client Component        | Reading a client context requires it   |

## Common mistake

Do not add `"use client"` to a component just because it's imported by one
that has it — the directive marks the boundary at the file that actually
needs client capabilities, not everything downstream of it. A Server
Component can be passed as `children` into a Client Component (e.g.
`AppLayout` → `SidebarProvider`) without itself becoming a Client
Component.

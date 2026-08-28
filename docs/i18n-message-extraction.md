# How i18n messages are extracted

Audience: contributors adding or changing user-facing copy.

There is no automated extraction tool (no `next-intl`/`react-intl` CLI, no
build-time scan for `t(...)` calls) -- messages are added by hand to
`lib/i18n/messages.ts`. This doc is the manual process that replaces a
tool.

## 1. Never hardcode user-facing copy in a component

Every string a user sees goes through `t(key)` (from `lib/i18n/t.ts`), not
a literal string in JSX. This is what makes translation possible at all --
a hardcoded string can never be picked up, automatically or manually.

```tsx
// Wrong
<h1>No invoices yet</h1>

// Right
<h1>{t("dashboard.empty.title")}</h1>
```

## 2. Add the key to `en` first

`lib/i18n/messages.ts`'s `en` object is the source of truth: every key
that exists anywhere in the app must exist here, since `en` is also
{@link DEFAULT_LOCALE}'s dictionary and every other locale's fallback (see
§4).

**Key naming**: dot-namespaced, `<area>.<element>.<variant>`, lowercase,
matching the existing keys:

```ts
"nav.dashboard": "Dashboard",
"dashboard.empty.title": "No invoices yet",
"dashboard.empty.description": "Invoices you post or fund will show up here.",
```

The namespace prefix (`nav`, `dashboard`, `portfolio`, ...) should match
the route or component area the string belongs to -- that's what makes a
long, flat key list still scannable.

## 3. Translating for another locale is optional, and partial is fine

`es` (and any future locale) is typed `Partial<Record<MessageKey, string>>`
-- intentionally. Add a translation when product has signed off on it;
until then, `t(key, "es")` transparently falls back to `en`'s value (see
§4). You do not need to translate a key into every locale in the same PR
that introduces it.

## 4. The fallback chain, and how to verify it

`t(key, locale)` (`lib/i18n/t.ts`) resolves in this order:

1. `locale`'s own dictionary, if it has `key`.
2. `DEFAULT_LOCALE`'s dictionary (`en`), if *it* has `key` (this is the
   "translated in `en`, not yet in `es`" case from §3).
3. The raw `key` string itself, if no locale has it at all.

Steps 2 and 3 both log a dev-only `console.warn` (suppressed in
production) so a missing/mistyped key is visible without ever throwing or
rendering `"undefined"`. See `lib/i18n/t.test.ts` for the executable
version of all three branches, including that step 1 does *not* warn.

## 5. `DEFAULT_LOCALE` is env-configurable

The app-wide default locale is `"en"` unless the `DEFAULT_LOCALE` env var
names another locale that actually exists in `lib/i18n/messages.ts`'s
`locales` map -- an unset or unrecognized value falls back to `"en"`
rather than producing a `Locale` with no dictionary. See
`lib/i18n/messages.test.ts`.

## Checklist for adding a new user-facing string

1. Add the key + English copy to `en` in `lib/i18n/messages.ts`.
2. Call `t("your.new.key")` from the component -- never inline the string.
3. If a translation is ready, add it to `es`; if not, skip it (§3).
4. If the component/hook has tests asserting on rendered text, assert on
   the `t()`-resolved value, not a hardcoded copy of the English string,
   so the test doesn't silently drift from the dictionary.

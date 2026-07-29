# Optional shorthands around the npm scripts already defined in
# package.json -- `just` is not required to work on this repo; every
# recipe here is a thin, idempotent wrapper around an existing npm script.

# Type-check the project (tsc --noEmit).
typecheck:
    npm run typecheck

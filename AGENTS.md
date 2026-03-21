# Repository Guidelines

## Code Simplicity & Maintenance

- **CRITICAL:** DRY is non-negotiable for code quality and maintainability, before any edits study existing code, extract similar behavior to helpers, keep reusable and composable
- **CRITICAL:** never mix indentation; match existing files exactly; new files use project's standard indentation
- Favor open-closed principle: extend via composition/helpers, not modifying existing behavior
- Separation of concerns is important
- Sort functions inside a class by reading order and program flow; helpers are above the function that uses it
- Prefer minimal, readable implementations with low duplication
- Reduce code size where it does not harm clarity or correctness
- Add comments only when non-obvious (don't delete existing ones, they exist intentionally!)
- Keep functions small and focused; use explicit return types
- Write helpers (and any code) for reuse inside and outside module; keep logic common and composable, ensure clarity and stability
- Normalize inputs before validation; handle edge cases intentionally
- Known pitfalls: skipping helper extraction or tests, duplicating patterns

## Quality Requirements

- Keep changes focused and minimal
- Follow existing code patterns

## Coding Style & Naming Conventions

- **CRITICAL:** use English for code and docs unless localization files require otherwise
- Follow repo's formatter and lint rules
- Choose consistent naming (camelCase, PascalCase, snake_case) based on existing patterns; examples if you start fresh:
  - Variables/functions use `camelCase`; class names and components use `PascalCase`; constants use `UPPER_SNAKE_CASE`; private/internal members use a ending underscore (e.g., `myVar_`)
- Use explicit types or interfaces where they improve clarity
- **Docs:** DRY principle applies - single source of truth; if command/pattern appears multiple times, consolidate to one location and reference it elsewhere

## Testing Guidelines

- Place tests alongside source or in the repo's designated test directories
- Prefer fast unit tests; add integration/e2e tests for critical paths
- Keep fixtures small and reuse setup helpers where possible
- Use data driven tests where possible
- Use coverage tools to identify untested code
- Test edge cases and error handling explicitly
- **CRITICAL:** Ask before you delete any tests!

## Commit & Pull Request Guidelines

- Follow conventional commits with :emoji: as seen in history (`build(devcontainer): :hammer: …`); scopes stay optional but recommended
- Write commit subjects in present tense, emphasize intent
- Keep diffs scoped to one concern
- PRs should include a concise summary, linked issue/ticket, and test evidence when applicable
- Ensure you use the correct VCS commands:
  - `.jj` folder exists and maybe a `.git` file or folder is present => use `jj` commands **only**!
  - `.git` file or folder exists and no `.jj` folder is present => use `git` commands
  - If none of the above are found, look for other VCS systems and use their CLI commands

## Package Manager

- **CRITICAL:** Always use `pnpm` (not npm/yarn); `pnpm-lock.yaml` is the lock file

## Environment & Security Notes

- Secrets belong in `.env`; never commit real credentials; use `*.example` files as baseline
- Document required external services or certificates

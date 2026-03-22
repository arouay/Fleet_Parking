# Step 3 - Code Quality & CI/CD

## Code Quality Tools

- **ESLint** with `@typescript-eslint`: static analysis to catch bugs, enforce conventions, and prevent anti-patterns specific to TypeScript.
- **Prettier**: automatic code formatting to ensure consistency across the codebase and eliminate style debates.
- **TypeScript strict mode**: catches type errors at compile time — null checks, implicit any, strict function types, etc.

## CI/CD Process

A pipeline (GitHub Actions, GitLab CI, etc.) triggered on every push and pull request:

1. **Install dependencies** — `npm ci` (deterministic install from lockfile)
2. **Lint** — `npx eslint .` (static analysis)
3. **Type check** — `npx tsc --noEmit` (verify types without emitting files)
4. **Test** — `npm test` (BDD tests: all scenarios in-memory + @critical against SQLite)
5. **Build** — `npx tsc` (compile TypeScript for deployment)

For production-grade validation, a separate CI job can run `cucumber-js --profile postgres` against a PostgreSQL service container to test with the real database engine.

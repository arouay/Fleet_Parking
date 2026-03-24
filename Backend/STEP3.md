# Step 3 - Code Quality & CI/CD

## Code Quality Tools

- **ESLint** with `@typescript-eslint`: static analysis to catch bugs, enforce conventions, and prevent anti-patterns specific to TypeScript.
- **Prettier**: automatic code formatting to ensure consistency across the codebase and eliminate style debates.
- **TypeScript strict mode** (already enabled): catches type errors at compile time — null checks, implicit any, strict function types, etc.

## CI/CD Process

### CI (Continuous Integration)

A GitHub Actions pipeline (`.github/workflows/ci.yml`) triggered on every push and pull request:

1. **Install dependencies** — `npm ci` (deterministic install from lockfile)
2. **Type check** — `npx tsc --noEmit` (verify types without emitting files)
3. **Test** — `npm test` (BDD tests: all scenarios in-memory + @critical against SQLite)

For production-grade validation, a PostgreSQL service container can be added to the pipeline to run `cucumber-js --profile postgres`.

### CD (Continuous Deployment)

On merge to `main`, a deployment pipeline would:

1. **Build** — `npx tsc` (compile TypeScript to JavaScript)
2. **Deploy** — push the compiled application to the target environment (e.g., Docker image to a registry, or deploy to a cloud service like AWS, GCP, etc.)
3. **Run migrations** — execute database migrations against the target environment's PostgreSQL instance
4. **Health check** — verify the deployed application is running correctly

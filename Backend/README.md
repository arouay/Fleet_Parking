# Vehicle Fleet Parking Management

A vehicle fleet parking management system built with **DDD**, **CQRS**, and **BDD** principles using Node.js and TypeScript.

## Prerequisites

- Node.js >= 18
- PostgreSQL (for CLI and production use)

## Installation

```bash
npm install
```

## Running Tests

```bash
# All scenarios in-memory + @critical scenarios against SQLite
npm test

# All scenarios in-memory only
npm run test:memory

# All scenarios against SQLite
npm run test:sqlite
```

### Why SQLite for tests?

SQLite is used as the default test database to allow the reviewer to run `npm test` immediately, without needing to install or configure PostgreSQL. It provides real SQL persistence testing with zero setup.

For production-grade validation, a PostgreSQL profile is available. To run tests against PostgreSQL:

```bash
DB_HOST=localhost DB_PORT=5432 DB_NAME=fleet_test DB_USER=postgres DB_PASSWORD=secret npx cucumber-js --profile postgres
```

The repository interface ensures that all three implementations (in-memory, SQLite, PostgreSQL) are interchangeable — the same step definitions run against any of them.

## CLI Usage

The CLI connects to PostgreSQL. Configure the connection via environment variables:

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `fleetdb` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | `mysecret` | Database password |

```bash
# Create a fleet (outputs the fleet ID)
npm run fleet -- create <userId>

# Register a vehicle in a fleet
npm run fleet -- register-vehicle <fleetId> <vehiclePlateNumber>

# Park a vehicle at a location
npm run fleet -- localize-vehicle <fleetId> <vehiclePlateNumber> <lat> <lng> [alt]
```

## Project Structure

```
src/
  App/                          # Application layer (CQRS)
    Commands/                   # Command objects (write intent)
    Handlers/                   # Command handlers (orchestration)
  Domain/                       # Domain layer (business logic)
    Entities/                   # Fleet (aggregate root), Vehicle
    ValueObjects/               # Location
    Repositories/               # Repository interface
  Infra/                        # Infrastructure layer
    InMemoryFleetRepository.ts  # In-memory implementation
    SqliteFleetRepository.ts    # SQLite implementation (tests)
    PostgresFleetRepository.ts  # PostgreSQL implementation (production)
  cli.ts                        # CLI entry point
features/                       # Gherkin feature files (BDD)
step_definitions/               # Cucumber step implementations
```

## Architecture

- **Domain**: Contains business rules, entities, value objects, and the repository interface. No external dependencies.
- **App**: CQRS commands and handlers. Depends on Domain only (via repository interface).
- **Infra**: Repository implementations (in-memory, SQLite, PostgreSQL). Depends on Domain.

The repository interface in Domain enables swapping persistence without changing application or domain code.

# ADR-0009: Use Vitest and Playwright for testing

**Status:** Accepted  
**Date:** 2026-07-21  
**Decision owner:** Project author

## Context

ReviewFlow AI has three runtimes that need testing: the Express API, the BullMQ worker, the shared packages (Zod schemas, domain types, utilities), and the Next.js web application.

Each layer has different testing needs:

- **Shared package:** pure functions and schema validation — fast, dependency-free unit tests.
- **API:** route handling, middleware, authentication, authorization, and integration with PostgreSQL and object storage.
- **Worker:** job handlers, retry logic, idempotency, and AI provider adapters.
- **Web:** React components, page rendering, and user flows through the browser.

The project needs a testing strategy that works across all four layers without introducing a different tool per layer.

## Decision

ReviewFlow will use:

| Tool | Layer | Scope |
|---|---|---|
| **Vitest** | `packages/shared`, `apps/api`, `apps/worker`, `apps/web` | Unit tests, integration tests, component tests |
| **Playwright** | `apps/web` | End-to-end browser tests |

### Vitest

Vitest will run all tests that do not require a browser. The same runner covers:

- **Shared package:** schema validation, type guards, and utility function tests.
- **API:** service tests with mocked dependencies, and integration tests using Supertest against the Express app.
- **Worker:** job handler logic with mocked queues and storage.
- **Web:** React component and hook tests via `@testing-library/react`.

Vitest is chosen over Jest because:

- It uses the same Vite transform pipeline as Next.js, so tsconfig path aliases, ESM, and TypeScript work without additional configuration.
- Its watch mode is faster and more reliable in monorepo setups.
- Its `expect` and `vi` APIs are Jest-compatible, so the testing patterns are familiar.
- It natively supports workspaces, making it straightforward to run all package tests from a single root command.

### Playwright

Playwright will run full browser tests against the deployed Next.js application. These tests cover critical user flows such as sign-up, document upload, comparison review, and task approval.

Playwright is chosen over Cypress because:

- It supports Chromium, Firefox, and WebKit from the same test runner.
- It includes built-in test retries, tracing, and video recording for debugging failures.
- Its network interception and parallel execution are faster in CI.
- It can test server-side rendered pages without additional configuration.

## Alternatives considered

### Jest

**Benefits:** largest ecosystem, broad community, widespread documentation.

**Why not now:** Jest requires additional configuration for ESM, TypeScript, and path aliases that Next.js and Vite handle natively. In a monorepo, Jest's per-package configuration creates more overhead than Vite's native workspace support.

### Jest with vitest --jest-compat

**Benefits:** would allow retaining Jest config syntax.

**Why not now:** running Jest-compat mode adds an unnecessary abstraction layer. Vitest's native API already matches Jest's `describe`/`it`/`expect` pattern, so there is no migration cost.

### Cypress

**Benefits:** mature community, interactive test runner, strong documentation.

**Why not now:** Playwright provides equally mature E2E capabilities with faster execution, parallel test support without a paid dashboard, and identical syntax for component and E2E tests. For V1, Playwright's built-in tracing and retries reduce debugging overhead.

### Mocha + Chai

**Benefits:** explicit, minimal, and widely understood.

**Why not now:** Mocha requires assembling an assertion library, a mocking library (Sinon), and a reporter separately. Vitest bundles all of these with a faster runner.

## Consequences

### Positive

- One test runner (Vitest) for all non-browser tests, reducing cognitive overhead.
- Vitest + Supertest covers the Express API without a separate tool.
- Playwright provides reliable E2E coverage with retries and tracing.
- Both tools are well-documented and actively maintained.
- Tests can run from a single root command through Turborepo's task orchestration.

### Trade-offs

- Adding Vitest to a Next.js project means two Vite instances (Next.js internal for dev, Vitest for tests). This is expected and supported.
- Playwright browser tests are slower than unit tests and should be reserved for critical user flows, not every component.
- The team must learn Playwright's async API and selector patterns if unfamiliar.

### Required guardrails

1. Unit-test pure domain logic and validation schemas thoroughly — these cost nothing to run.
2. Use integration tests (Vitest + Supertest) for API route behavior, authentication, authorization, and error responses.
3. Mock external dependencies (AI providers, object storage, Redis) in worker and service tests.
4. Reserve Playwright E2E tests for the core user flow: upload → process → review → approve.
5. Do not write Playwright tests for pages that change frequently until the UI stabilizes.
6. Run Vitest on every commit (CI). Run Playwright only on push to main or before release.
7. Keep test files colocated with source files using the `*.test.ts` convention.

## Assumptions

- Vitest will not conflict with Next.js's internal Vite configuration.
- Playwright's browser downloads can be cached in CI to keep setup time reasonable.
- The test pyramid (many unit → some integration → few E2E) is appropriate for this project's complexity.

## Revisit triggers

Revisit this decision if any of the following occurs:

- Vitest introduces significant configuration overhead in the Next.js app as the project grows.
- Playwright test suite runtime exceeds CI time budgets despite parallel execution.
- A testing requirement (mobile testing, visual regression, API mocking) is better served by an additional or alternative tool.

If the decision changes, create a new ADR that supersedes this one rather than rewriting its history.

# ADR-0001: Use Next.js for the web application and Node.js with Express for the API

**Status:** Accepted  
**Date:** 2026-07-21  
**Decision owner:** Project author

## Context

ReviewFlow needs a browser-facing dashboard, an authenticated and organization-scoped API, asynchronous document processing, and a worker that can run independently of HTTP requests.

The initial project plan recommended Next.js and NestJS. For V1, the project author wants to learn the Node.js runtime and Express HTTP framework directly rather than begin with NestJS's decorators, dependency-injection container, and module abstractions.

Node.js and Express are not competing choices:

- **Node.js** is the JavaScript runtime that executes server-side code.
- **Express** is a lightweight HTTP framework that runs on Node.js.

Next.js remains the planned web application framework. It may itself execute server-side code on Node.js, but it does not replace the independently deployable API and worker boundaries required by the proposed architecture.

## Decision

ReviewFlow will use:

```text
apps/web     → Next.js dashboard
apps/api     → Node.js application using Express and a REST API
apps/worker  → Node.js background worker
```

The Express API will own:

- authentication and organization authorization;
- document and document-version metadata;
- signed object-storage URL creation;
- review-task, review-decision, and audit-event endpoints;
- request validation and consistent error responses;
- enqueueing background jobs for the worker.

The API will not perform long-running extraction or AI comparison work inside an HTTP request.

The application structure should keep route handlers thin and place business rules in framework-independent modules. This allows the project to learn Express without coupling the core domain model to Express-specific code.

## Alternatives considered

### NestJS

**Benefits:** strong conventions, modules, dependency injection, decorators, and built-in patterns for large teams.

**Why not now:** it adds framework abstractions before the project author has worked directly with Node.js and Express request handling, middleware, routing, validation, and error behavior. It can be reconsidered if explicit Express conventions become insufficient.

### Next.js Route Handlers as the only backend

**Benefits:** fewer deployments and a smaller initial codebase.

**Why not now:** the project benefits from an explicit API boundary that can be independently documented, tested, deployed, and used by the web app and future integrations. It also keeps long-running work clearly outside the web application.

### Fastify

**Benefits:** good performance characteristics and a modern plugin model.

**Why not now:** Express has a smaller initial learning surface for the stated goal and a large ecosystem of learning resources. This is not a claim that Express is universally superior.

## Consequences

### Positive

- Builds direct understanding of Node.js server execution and Express middleware/routing.
- Keeps HTTP behavior, validation, authentication, and error handling explicit.
- Preserves separate web, API, and worker deployment boundaries.
- Avoids adding NestJS concepts before they solve a demonstrated problem.
- Supports a REST-first API and future OpenAPI documentation.

### Trade-offs

- Express supplies fewer architectural conventions than NestJS.
- The project must define its own module boundaries, request-validation middleware, error-handling middleware, logging, and dependency-management patterns.
- Consistency will depend on discipline and tests rather than framework defaults.

### Required guardrails

1. Validate untrusted API inputs at the boundary using shared Zod schemas.
2. Centralize error handling rather than returning ad hoc errors from routes.
3. Keep organization authorization in API/service layers, not only in UI checks.
4. Organize code by domain/module rather than placing business logic in route handlers.
5. Keep worker job handlers separate from Express routes and make retries idempotent.
6. Document REST endpoints with OpenAPI when the API surface is introduced.

## Assumptions

- A REST API is sufficient for V1 browser interactions.
- Express can support the initial API complexity when paired with clear module conventions and tests.
- Next.js, Express, and the worker can share stable schemas and types through `packages/shared`.

## Revisit triggers

Revisit this decision if any of the following occurs:

- the API accumulates enough modules or cross-cutting concerns that manual composition is consistently slowing delivery;
- dependency management or test setup becomes difficult to reason about;
- performance or observability requirements make another HTTP framework materially better;
- a platform constraint requires a different deployment or API architecture.

If the decision changes, create a new ADR that supersedes this one rather than rewriting its history.

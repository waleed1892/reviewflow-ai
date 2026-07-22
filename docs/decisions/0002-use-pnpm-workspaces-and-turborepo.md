# ADR-0002: Use pnpm workspaces and Turborepo for the monorepo

**Status:** Accepted  
**Date:** 2026-07-21  
**Decision owner:** Project author

## Context

ReviewFlow contains multiple independently runnable applications and shared code:

```text
apps/web
apps/api
apps/worker
packages/shared
```

The web application, API, and worker need compatible shared schemas and domain types. Running separate repositories or duplicating contracts would make coordinated changes harder and increase the chance of API and worker drift.

## Decision

Use a pnpm workspace with Turborepo at the repository root.

- pnpm workspace globs discover packages under `apps/*` and `packages/*`.
- Workspace packages use `workspace:*` references for internal dependencies.
- Turborepo orchestrates package scripts such as `dev`, `build`, `lint`, `typecheck`, and `test`.
- Shared runtime schemas and domain types belong in `packages/shared`.

## Alternatives considered

### Multiple repositories

**Benefit:** independent release cadence and simpler repository boundaries.

**Why not now:** ReviewFlow is one product with tightly coordinated schemas and an early-stage team of one. The operational cost and contract-publishing workflow are not justified.

### npm or Yarn workspaces

**Benefit:** familiar ecosystem choices.

**Why not now:** pnpm provides efficient disk usage, explicit workspace behavior, and a package-manager version pin already selected for the repository. Turborepo integrates cleanly with it.

### No task orchestrator

**Benefit:** fewer tools.

**Why not now:** the project needs consistent commands and dependency-aware build ordering as more applications and packages are added.

## Consequences

### Positive

- One source of truth for shared contracts.
- Consistent local and CI commands.
- Faster coordinated changes across web, API, and worker.
- Clear package boundaries before applications are implemented.

### Trade-offs

- Workspace dependency boundaries and build outputs require deliberate configuration.
- Root tooling is another concept to learn and maintain.
- A monorepo does not remove the need for clear application ownership.

## Required guardrails

1. Keep shared packages framework-neutral where possible.
2. Do not import API implementation code directly into the web application.
3. Use `workspace:*` for internal package dependencies.
4. Define only scripts that packages can actually support; avoid placeholder passing scripts.
5. Keep generated outputs and `node_modules` out of version control.

## Revisit triggers

Revisit if package installation, build orchestration, or release workflows become a demonstrated bottleneck, or if an independently operated product requires a genuinely separate repository.

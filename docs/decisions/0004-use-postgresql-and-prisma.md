# ADR-0004: Use PostgreSQL with Prisma as the V1 system of record

**Status:** Accepted  
**Date:** 2026-07-21  
**Decision owner:** Project author

## Context

ReviewFlow needs durable, transactional relationships among organizations, memberships, documents, versions, comparison runs, change findings, citations, review tasks, decisions, comments, and audit events.

The model requires tenant-scoped queries, constraints such as one current approved version per document, reliable migrations, and testable data access. The project author has selected Prisma for application data access and schema management.

## Decision

Use PostgreSQL as the relational system of record and Prisma for schema definition, migrations, and application data access.

- PostgreSQL stores application and audit data.
- Prisma models represent the relational schema after the conceptual data model is validated.
- Prisma migrations evolve the schema in a reviewable, repeatable way.
- Services/repositories must still enforce organization authorization; Prisma is not an authorization layer.
- Uploaded source files remain in object storage, not relational database blobs.
- pgvector and embeddings are deferred until a validated semantic-retrieval use case exists.

## Alternatives considered

### Document-oriented database

**Benefit:** flexible document-shaped records and fast early iteration.

**Why not now:** ReviewFlow's core data is relationship-heavy and transactional. Tenant scoping, review tasks, decisions, audit events, and version constraints fit a relational model better.

### PostgreSQL without an ORM

**Benefit:** direct SQL control and no ORM abstraction.

**Why not now:** Prisma provides a useful learning path for migrations, typed query construction, and schema visibility while the project is still evolving.

### Another TypeScript ORM

**Benefit:** different trade-offs in query style, performance, or SQL proximity.

**Why not now:** Prisma has broad documentation and migration tooling suitable for the project's V1 learning goals. This is not a claim that it is universally superior.

### PostgreSQL with pgvector immediately

**Benefit:** future embedding support is anticipated by the roadmap.

**Why not now:** vector search is not required for the initial document-version comparison workflow. Adding it before a validated retrieval need increases operational and schema complexity.

## Consequences

### Positive

- Strong relational integrity for the domain model.
- Transaction support for state changes and audit records.
- Repeatable migrations and type-aware application data access through Prisma.
- Clear path to future pgvector adoption without making it a V1 dependency.

### Trade-offs

- Prisma schema design and migrations must be learned and maintained.
- ORM abstractions do not remove the need to understand generated SQL, indexes, transactions, and tenant filters.
- PostgreSQL must be provisioned for local development, testing, and deployment.

## Required guardrails

1. Add `organizationId` to every organization-owned Prisma model.
2. Enforce foreign keys, unique constraints, and transaction boundaries for stateful operations.
3. Treat Prisma query filters as part of authorization defense, not a replacement for service-level checks.
4. Add indexes based on actual query paths, especially organization, document, task status, assignee, and timestamps.
5. Keep audit records append-only.
6. Add pgvector only through a new ADR when a retrieval/evaluation requirement justifies it.

## Revisit triggers

Revisit if relational queries become an unsuitable fit for a validated workload, Prisma blocks required database capabilities, or semantic search becomes a proven requirement.

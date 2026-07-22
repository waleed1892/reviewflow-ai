# ADR-0003: Use organization-scoped multi-tenancy and membership-based authorization

**Status:** Accepted  
**Date:** 2026-07-21  
**Decision owner:** Project author

## Context

ReviewFlow is a multi-tenant SaaS. Different organizations must be able to upload and review SOPs without accessing one another's documents, findings, tasks, or audit history.

A User may belong to more than one Organization and may have a different application role in each one. The domain model represents this relationship through a Membership.

## Decision

Use a shared application and shared PostgreSQL database with organization-scoped ownership and membership-based authorization.

- Every organization-owned resource carries an organization identity.
- A Membership connects a User to an Organization and assigns an application role: `Owner`, `Admin`, `Reviewer`, or `Member`.
- API and service-layer operations must establish the active organization context before reading or modifying tenant data.
- Authorization checks verify both organization membership and role/assignment requirements.
- Review tasks are additionally constrained by their assignee and task-specific authorization.
- Audit events record the organization and acting user for meaningful actions.

## Alternatives considered

### Single-tenant application

**Benefit:** simpler initial data access and authorization.

**Why not now:** tenant isolation is a core product requirement and a key learning objective for the project.

### Database per organization

**Benefit:** strong physical data isolation.

**Why not now:** it creates operational overhead for provisioning, migrations, reporting, backups, and local development that is disproportionate for V1.

### Rely only on client-side organization selection

**Benefit:** minimal server-side implementation.

**Why not now:** client-side checks are not a security boundary and cannot protect APIs or direct request attempts.

## Consequences

### Positive

- Supports multiple organizations in one deployable product.
- Models real SaaS membership and role behavior.
- Preserves a clear tenant boundary in documents, tasks, decisions, and audit events.

### Trade-offs

- Every query and mutation needs tenant-scoping discipline.
- Cross-tenant bugs are high-severity security defects.
- Reporting and administrative operations need explicit access rules.

## Required guardrails

1. Never accept an organization identifier from a client without validating that the authenticated user belongs to it.
2. Scope organization-owned queries and mutations by organization identity in service/repository layers.
3. Test cross-tenant denial cases for every protected endpoint.
4. Do not infer business approval authority solely from a broad application role; use task assignment where appropriate.
5. Do not expose object-storage URLs without verifying organization access first.

## Revisit triggers

Revisit if regulatory, customer, or data-residency requirements demand stronger physical isolation, or if database-level row-level security becomes necessary as the application grows.

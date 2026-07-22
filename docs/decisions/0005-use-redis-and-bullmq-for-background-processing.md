# ADR-0005: Use Redis and BullMQ for background document processing

**Status:** Accepted  
**Date:** 2026-07-21  
**Decision owner:** Project author

## Context

Document extraction and AI comparison can be slow, variable in duration, dependent on external services, and prone to transient failures. Running this work inside an API request would create timeouts, poor user experience, weak retry behavior, and hard-to-observe failures.

ReviewFlow already separates browser-facing API responsibilities from document-processing responsibilities in its proposed architecture. Because the API and worker use Node.js, BullMQ is a suitable queue library for V1.

## Decision

Use Redis as BullMQ's backing store and run document-processing jobs in a separate Node.js worker.

- The API records the DocumentVersion and ComparisonRun, then enqueues a job.
- The worker extracts content, requests structured AI comparison, validates results, and persists comparison state/findings/citations.
- PostgreSQL remains the system of record for document and review state; Redis/BullMQ coordinates transient work.
- Jobs use bounded retries with observable failure states.
- Job handlers must be idempotent so a retry does not duplicate findings, tasks, or audit events.

## Alternatives considered

### Perform extraction and comparison synchronously in the API

**Benefit:** fewer running processes and simpler early code.

**Why not now:** it risks long HTTP requests, timeouts, unavailable UI requests, and fragile retry behavior.

### In-process background promises

**Benefit:** minimal initial infrastructure.

**Why not now:** work can be lost on process restart and cannot scale or retry reliably across deployments.

### Managed workflow service

**Benefit:** managed operations and advanced orchestration features.

**Why not now:** adds provider dependency and complexity before the V1 workload is understood.

### Another Node.js queue library

**Benefit:** different semantics or operational model.

**Why not now:** BullMQ is mature, Redis-backed, and suitable for the required Node.js retry and worker patterns.

## Consequences

### Positive

- Responsive API behavior during slow processing.
- Explicit job status, failure, retry, and observability boundaries.
- Independent worker scaling later.
- Clear separation between request authorization and processing execution.

### Trade-offs

- Redis and a worker process must be run locally and in deployment environments.
- Queue jobs introduce eventual consistency; users must see accurate processing status.
- Idempotency and retry behavior require deliberate implementation and tests.

## Required guardrails

1. Store canonical job/document state in PostgreSQL, not only in Redis.
2. Put identifiers and minimal safe metadata in jobs; do not trust client-supplied authorization in workers.
3. Use a stable idempotency key for each ComparisonRun.
4. Bound retries and record actionable failure reasons.
5. Prevent duplicate ReviewTasks when jobs retry.
6. Add tests for successful, failed, and retried jobs before relying on the worker for production-like flows.

## Revisit triggers

Revisit if job volume, scheduling, orchestration, or operational requirements exceed BullMQ's needs, or if a managed workflow service provides a justified operational advantage.

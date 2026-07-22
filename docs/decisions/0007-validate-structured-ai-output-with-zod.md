# ADR-0007: Validate structured AI output with shared Zod schemas

**Status:** Accepted  
**Date:** 2026-07-21  
**Decision owner:** Project author

## Context

ReviewFlow's value depends on AI-generated candidate findings being reviewable, source-grounded, and safe to persist. Free-form model text can be malformed, omit citations, invent unsupported fields, or vary across providers.

TypeScript types alone do not validate runtime data returned by an AI provider or sent by a browser. The web app, API, and worker also need a shared contract for document status, findings, citations, review tasks, and decisions.

## Decision

Use Zod schemas in `packages/shared` as runtime validation and shared contract definitions.

- The worker validates every AI response before creating ChangeFindings or SourceCitations.
- Invalid or incomplete AI output is treated as a processing failure or retry candidate, never as approved data.
- The API validates untrusted request inputs at its boundary.
- TypeScript types are inferred from the same schemas where appropriate.
- The worker records provider/model/prompt metadata and validation failure information needed for later evaluation and debugging.
- AI output remains advisory; schema validity does not make it correct or authorize publication.

## Alternatives considered

### Trust free-form AI text

**Benefit:** fastest prototype path.

**Why not now:** it cannot reliably create structured review tasks, citations, or audit-ready records.

### TypeScript types only

**Benefit:** no runtime schema library.

**Why not now:** TypeScript types are erased at runtime and cannot validate external provider responses or HTTP requests.

### JSON Schema only

**Benefit:** broad interoperability and provider compatibility.

**Why not now:** JSON Schema may still be useful for provider response formatting, but Zod provides the TypeScript-native runtime parsing and shared application contract needed by V1.

## Consequences

### Positive

- One source of truth for runtime validation and inferred TypeScript types.
- Safer persistence of AI-generated structured data.
- Shared contracts across the web app, API, and worker.
- Clear validation failures that can be measured and improved.

### Trade-offs

- Schemas need deliberate versioning as the product evolves.
- Valid schema output can still be semantically wrong, incomplete, or poorly cited.
- Provider-specific response formats may need adapters before Zod parsing.

## Required guardrails

1. Require category, severity, summary, and source citations for a reviewable finding.
2. Preserve enough failure context to debug invalid output without retaining more source content than necessary.
3. Never let a schema-valid response publish a DocumentVersion automatically.
4. Version prompts and schemas when changes affect evaluation behavior.
5. Test valid, malformed, missing-citation, and provider-failure responses.
6. Keep provider adapters separate from domain and review-decision logic.

## Revisit triggers

Revisit if a provider's native structured-output mechanism, a cross-language service boundary, or schema-performance needs justify a different validation approach. Any replacement must retain runtime validation and shared contract guarantees.

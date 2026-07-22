# ADR-0006: Store documents privately and use signed URLs for file transfer

**Status:** Accepted  
**Date:** 2026-07-21  
**Decision owner:** Project author

## Context

ReviewFlow processes sensitive operational procedures and may later process vendor policies, supplier agreements, and RFPs. Source documents should not be publicly accessible or stored as large binary objects in the relational database.

Browsers need to upload and retrieve authorized source files without receiving long-lived cloud-storage credentials. The API must retain organization authorization control.

## Decision

Use private, S3-compatible object storage for source documents and derived artifacts. The API authorizes access and issues short-lived signed upload or download URLs.

- PostgreSQL stores document/version metadata and object references.
- Object storage stores source files and large derived artifacts.
- The browser uploads/downloads directly with a time-limited URL after API authorization.
- The worker reads private objects using trusted service credentials.
- Local development may use MinIO; the production S3-compatible provider remains deferred.

## Alternatives considered

### Store file bytes in PostgreSQL

**Benefit:** one system to back up and secure.

**Why not now:** large binary content complicates database storage, backup, performance, and lifecycle management.

### Public object URLs

**Benefit:** simple browser access.

**Why not now:** public URLs are incompatible with private organizational documents and tenant-isolation requirements.

### Proxy every file through the API

**Benefit:** one authorization path.

**Why not now:** it makes the API a file-transfer bottleneck. Signed URLs preserve API authorization while allowing scalable direct transfer.

## Consequences

### Positive

- Private source documents with short-lived, authorized access.
- Better separation between relational metadata and large file content.
- Efficient browser transfers and worker access.
- Provider portability through an S3-compatible interface.

### Trade-offs

- Two durable systems require consistent references and cleanup behavior.
- Signed URL expiry, object lifecycle, and failed-upload cleanup need implementation.
- Storage access policies require careful configuration.

## Required guardrails

1. Keep buckets/containers private; never rely on obscurity of object keys.
2. Authorize the user and organization before issuing every signed URL.
3. Validate file size, MIME type, and content signature before accepting a version for processing.
4. Use object keys that are organization and version scoped but do not expose sensitive names unnecessarily.
5. Do not store permanent signed URLs in PostgreSQL.
6. Define cleanup behavior for failed uploads and abandoned drafts.

## Revisit triggers

Revisit if document size, retention, residency, malware-scanning, or compliance requirements demand a different storage provider or a dedicated document-management service.

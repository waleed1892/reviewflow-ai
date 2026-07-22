# ADR-0008: Use short-lived JWT access tokens with rotating refresh sessions

**Status:** Accepted  
**Date:** 2026-07-21  
**Decision owner:** Project author

## Context

ReviewFlow needs browser authentication for a multi-tenant SaaS. Users must be able to sign in, sign out from one device or all devices, lose access immediately when their organization membership or task assignment changes, and recover from suspected token theft.

The project author wants to learn JWT authentication. A pure stateless JWT design cannot immediately revoke a stolen access token because a valid token remains acceptable until its expiry. A long-lived JWT stored in browser-accessible storage is not appropriate for ReviewFlow.

## Decision

Use a hybrid authentication lifecycle:

```text
Short-lived signed JWT access token
+ opaque rotating refresh token
+ hashed RefreshSession record in PostgreSQL
+ current server-side session and authorization checks
```

### Access token

- Use `jose` to sign and verify JWT access tokens.
- Target a short lifetime of 10 minutes, configurable by environment.
- Transport the token in a `HttpOnly` cookie; use `Secure` in production and an appropriate `SameSite` policy for the deployment model.
- Verify the signature, explicit allowed algorithm, issuer, audience, expiry, and not-before claims on every protected request.
- Include only minimal claims: `sub` (user ID), `sid` (refresh-session ID), `jti`, `iss`, `aud`, `iat`, `nbf`, and `exp`.
- Do not place roles, active organization, document data, or review-task permissions in access-token claims.

### Refresh session

- Issue an opaque, cryptographically random refresh token at login.
- Store only its hash in PostgreSQL, in a `RefreshSession` record.
- Associate each refresh session with a user, token family, expiration, revocation state, and replacement history.
- Rotate the refresh token on every successful refresh: invalidate the old token and issue a new one atomically.
- Detect reuse of a previously rotated refresh token as a suspected replay attack; revoke the affected token family and require reauthentication.

### Authorization and revocation

- On every protected request, verify the JWT and confirm that its `sid` references an active RefreshSession.
- Authorize organization actions from current Membership and ReviewTask data, not stale token claims.
- A single-device logout revokes the related RefreshSession and clears browser cookies.
- A logout-from-all-devices action revokes all active RefreshSessions for the user and clears the current browser cookies.
- Revoking a RefreshSession invalidates access JWTs associated with its `sid` at their next API request, even if their `exp` has not passed.
- Record authentication lifecycle events such as login, logout, refresh-token replay detection, and all-session revocation in the audit trail.

## Alternatives considered

### Opaque server-side sessions only

**Benefits:** simpler revocation model and less token cryptography.

**Why not now:** it is a strong option, but the project author wants to learn JWT validation, claim design, signing keys, expiry, and hybrid revocation patterns.

### Pure stateless JWT access tokens

**Benefits:** no server-side session lookup for normal requests.

**Why not now:** it cannot immediately revoke a stolen token or reflect logout/session invalidation without a denylist or additional server-side state. ReviewFlow already needs current database-backed membership and task authorization checks.

### Long-lived JWT access tokens

**Benefits:** fewer refresh requests.

**Why not now:** theft exposure lasts too long and makes logout/revocation weak.

### Hosted authentication provider

**Benefits:** outsourced password, MFA, SSO, and identity lifecycle management.

**Why not now:** self-managed credentials authentication supports the project's Node.js, Express, Prisma, and security-learning goals. Hosted identity can be reconsidered for enterprise SSO or production compliance needs.

## Consequences

### Positive

- Builds direct experience with JWT signing, verification, claims, expiry, key configuration, and refresh-token rotation.
- Supports single-device and all-device logout.
- Supports immediate rejection of tokens tied to revoked sessions.
- Prevents stale organization roles and task assignments from becoming authorization truth.
- Keeps refresh credentials revocable and server-controlled.

### Trade-offs

- This is not fully stateless JWT authentication; protected requests require session and authorization state checks.
- Token rotation, refresh replay detection, cookie behavior, CSRF protection, and key rotation add implementation complexity.
- Authentication has a high security impact and needs focused tests and review.

## Required guardrails

1. Hash passwords with Argon2id; never store plaintext or reversible passwords.
2. Store access and refresh tokens only in `HttpOnly` cookies, never in `localStorage` or `sessionStorage`.
3. Use explicit JWT verification settings; never trust decoded but unverified claims.
4. Configure a strict algorithm allowlist rather than accepting a token-selected algorithm.
5. Validate `iss`, `aud`, `exp`, `nbf`, and signature on every protected request.
6. Use HTTPS in production and secure cookie attributes.
7. Protect state-changing cookie-authenticated routes with Origin checks and CSRF defenses.
8. Restrict credentialed CORS to known web origins; never use wildcard origins with credentials.
9. Rate-limit login, refresh, password-reset, and verification endpoints.
10. Rotate session identifiers after login, password change, privilege change, and suspected compromise.
11. Keep signing keys outside source control and define a key-rotation strategy before production deployment.
12. Test expired, malformed, invalid-signature, wrong-issuer, wrong-audience, revoked-session, refresh-replay, and cross-tenant authorization cases.

## Deferred details

The following are not decided by this ADR:

- Exact signing algorithm and key-management provider
- Exact refresh-session idle and absolute expiration values
- OAuth/social login, enterprise SSO, MFA, and passkeys
- Email verification and password-reset delivery provider
- Device-management UI and suspicious-login notification policy

## Revisit triggers

Revisit this decision if ReviewFlow adds mobile clients, third-party API consumers, OAuth/OIDC federation, enterprise SSO, MFA, passkeys, or requirements that make a managed identity provider preferable.

If this decision changes, create a new ADR that supersedes this one rather than rewriting its history.

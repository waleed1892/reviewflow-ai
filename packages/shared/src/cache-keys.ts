const PREFIX = "reviewflow:v1";

/**
 * Shared Cache Keys Factory across API, Worker, and shared packages.
 * Enforces key structure, namespacing, and multi-tenant isolation.
 */
export const CacheKeys = {
	// Organization Domain
	organization: (orgId: string) => `${PREFIX}:org:${orgId}`,
	organizationMembers: (orgId: string) => `${PREFIX}:org:${orgId}:members`,

	// User Domain
	user: (userId: string) => `${PREFIX}:user:${userId}`,

	// Document Domain (Multi-tenant isolated)
	document: (orgId: string, docId: string) =>
		`${PREFIX}:org:${orgId}:doc:${docId}`,
	documents: (orgId: string) => `${PREFIX}:org:${orgId}:docs`,
} as const;

export type CacheKeysFactory = typeof CacheKeys;

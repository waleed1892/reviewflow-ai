import { redisClient } from "./client.js";

export class CacheService {
	constructor(private readonly redis = redisClient) {}

	private get client() {
		return this.redis.isReady() ? this.redis.getClient() : null;
	}

	public async get<T>(key: string): Promise<T | null> {
		const client = this.client;
		if (!client) return null;

		try {
			const data = await client.get(key);
			if (!data) return null;
			return JSON.parse(data) as T;
		} catch (error) {
			console.warn(
				`⚠️ [CacheService] GET error for key "${key}". Falling back to source:`,
				error instanceof Error ? error.message : error,
			);
			return null;
		}
	}

	public async set<T>(
		key: string,
		value: T,
		ttlSeconds: number,
	): Promise<void> {
		const client = this.client;
		if (!client) return;

		try {
			const serialized = JSON.stringify(value);
			await client.set(key, serialized, {
				expiration: {
					type: "EX",
					value: ttlSeconds,
				},
			});
		} catch (error) {
			console.warn(
				`⚠️ [CacheService] SET error for key "${key}":`,
				error instanceof Error ? error.message : error,
			);
		}
	}

	public async delete(key: string): Promise<void> {
		const client = this.client;
		if (!client) return;

		try {
			await client.del(key);
		} catch (error) {
			console.warn(
				`⚠️ [CacheService] DEL error for key "${key}":`,
				error instanceof Error ? error.message : error,
			);
		}
	}

	public async exists(key: string): Promise<boolean> {
		const client = this.client;
		if (!client) return false;

		try {
			const count = await client.exists(key);
			return count > 0;
		} catch (error) {
			console.warn(
				`⚠️ [CacheService] EXISTS error for key "${key}":`,
				error instanceof Error ? error.message : error,
			);
			return false;
		}
	}

	public async getOrSet<T>(
		key: string,
		loader: () => Promise<T>,
		ttlSeconds = 3600,
	): Promise<T> {
		const cached = await this.get<T>(key);
		if (cached !== null) {
			return cached;
		}

		const freshValue = await loader();

		if (freshValue !== undefined && freshValue !== null) {
			await this.set(key, freshValue, ttlSeconds);
		}

		return freshValue;
	}
}

export const cacheService = new CacheService();

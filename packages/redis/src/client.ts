import { createClient, type RedisClientType } from "redis";

export class RedisClient {
	private client: RedisClientType | null = null;

	public isReady(): boolean {
		return Boolean(this.client?.isReady);
	}

	public getClient(): RedisClientType {
		if (!this.client) {
			throw new Error("Redis client is not initialized. Call connect() first.");
		}
		return this.client;
	}

	public async connect(): Promise<RedisClientType> {
		if (this.client?.isOpen) {
			return this.client;
		}

		const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

		if (!this.client) {
			this.client = createClient({ url: redisUrl });

			this.client.on("error", (err) => {
				console.error("❌ Redis Client Error:", (err as Error).message || err);
			});
		}

		await this.client.connect();

		return this.client;
	}

	public async disconnect(): Promise<void> {
		if (!this.client?.isOpen) {
			return;
		}

		try {
			await this.client.quit();
		} catch {
			this.client.destroy();
		} finally {
			this.client = null;
		}
	}
}

export const redisClient = new RedisClient();

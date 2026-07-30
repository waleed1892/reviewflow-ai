import dotenv from "dotenv";
import { z } from "zod";
import { logger } from "./logger";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.string().default("3001"),
	DATABASE_URL: z.url(
		"DATABASE_URL must be a valid PostgreSQL connection string",
	),
	REDIS_URL: z.string().default("redis://localhost:6379"),
	ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
	LOG_LEVEL: z.enum(["info", "debug", "warn", "error"]).default("info"),
	JWT_ISSUER: z.string().default("reviewflow-api"),
	JWT_AUDIENCE: z.string().default("reviewflow-web"),
	JWT_ACCESS_EXPIRATION: z.string().default("10m"),
	REFRESH_TOKEN_EXPIRATION: z.coerce.number().default(7),
	JWT_SECRET: z
		.string()
		.min(32, "JWT_SECRET must be at least 32 characters long"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	logger.error(
		`❌ Invalid or Missing Environment Variables:
		${JSON.stringify(z.treeifyError(_env.error), null, 2)}`,
	);
	process.exit(1); // Halt server immediately before boot
}

export const env = _env.data;

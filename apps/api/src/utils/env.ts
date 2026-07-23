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
	ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
	LOG_LEVEL: z.enum(["info", "debug", "warn", "error"]).default("info"),
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

import { redisClient } from "@reviewflow-ai/redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import { pinoHttp } from "pino-http";
import { globalErrorHandler } from "@/middleware/error-handler";
import { globalRateLimiter } from "@/middleware/rate-limitter";
import { logger } from "@/utils/logger";
import { mainRouter } from "./router";
import { env } from "./utils/env";

const app = express();

const port = env.PORT;

redisClient
	.connect()
	.then(() => {
		logger.info("✅ Redis connected successfully");
	})
	.catch(() => {
		logger.warn(
			"⚠️ Redis failed to connect during boot. Operating in fail-open mode:",
		);
	});

app.use(helmet());
app.use(
	cors({
		origin: env.ALLOWED_ORIGINS,
	}),
);
app.use(cookieParser());

app.use(pinoHttp({ logger }));

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(globalRateLimiter);

app.use("/api/v1", mainRouter);

app.use((_, res) => {
	res.status(StatusCodes.NOT_FOUND).json({
		message: "Route not found",
	});
});

app.use(globalErrorHandler);

const server = app.listen(port, () => {
	logger.info(`🚀 API server running on port: ${port}`);
});

const gracefulShutdown = async (signal: string) => {
	console.info(
		`\n⚠️  Received ${signal}. Shutting down HTTP server gracefully...`,
	);
	server.close(async () => {
		await redisClient.disconnect();
		console.info(
			"✅ HTTP server and Redis client closed. Process exiting cleanly.",
		);
		process.exit(0);
	});
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

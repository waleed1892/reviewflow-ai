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

app.use(helmet());
app.use(
	cors({
		origin: env.ALLOWED_ORIGINS,
	}),
);

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

const gracefulShutdown = (signal: string) => {
	console.info(
		`\n⚠️  Received ${signal}. Shutting down HTTP server gracefully...`,
	);
	server.close(() => {
		console.info("✅ HTTP server closed. Process exiting cleanly.");
		process.exit(0);
	});
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

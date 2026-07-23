import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import { pinoHttp } from "pino-http";
import { globalErrorHandler } from "./middleware/error-handler.js";
import { globalRateLimiter } from "./middleware/rate-limitter.js";
import { logger } from "./utils/logger.js";

dotenv.config();

const app = express();

const port = process.env.PORT || "3001";

app.use(helmet());
app.use(
	cors({
		origin: process.env.ALLOWED_ORIGINS || "http://localhost:3000",
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

app.get(`/api/health`, (_, res) => {
	res.status(StatusCodes.OK).json({
		status: "UP",
		uptime: process.uptime(),
		timestamp: new Date(),
		memory: process.memoryUsage(),
		message: "Server is running normally",
	});
});

app.use((_, res) => {
	res.status(StatusCodes.NOT_FOUND).json({
		message: "Route not found",
	});
});

app.use(globalErrorHandler);

const server = app.listen(port, () => {
	console.log(`App started on port:${port}`);
});

const gracefulShutdown = (signal: string) => {
	console.log(
		`\n⚠️  Received ${signal}. Shutting down HTTP server gracefully...`,
	);
	server.close(() => {
		console.log("✅ HTTP server closed. Process exiting cleanly.");
		process.exit(0);
	});
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

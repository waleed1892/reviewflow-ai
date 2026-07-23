import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
	level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
	redact: ["req.headers.authorization", "password", "token"],
	...(isProduction
		? undefined
		: {
				transport: {
					target: "pino-pretty",
					options: {
						colorize: true,
						translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
						ignore: "pid,hostname",
					},
				},
			}),
});

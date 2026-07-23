import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
	limit: 100,
});

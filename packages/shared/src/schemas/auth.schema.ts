import { z } from "zod";

export const registerSchema = z.object({
	name: z
		.string("Name is required")
		.min(2, "Name must be atleast 2 characters long")
		.trim(),
	email: z.email("Invalid email").toLowerCase().trim(),
	password: z
		.string("Password is required")
		.min(8, "Password must be atleast 8 characters long")
		.trim(),
});

export const loginSchema = z.object({
	email: z.email("Invalid email").toLowerCase().trim(),
	password: z
		.string("Password is required")
		.min(1, "Password is required")
		.trim(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

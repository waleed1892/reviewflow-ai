import { z } from "zod";

export const createDocumentSchema = z.object({
	title: z.string("Title is required").min(1, "Title is required").trim(),
	organization_id: z.string("Organization ID is required"),
});

export const updateDocumentSchema = z.object({
	title: z
		.string("Title is required")
		.min(1, "Title is required")
		.trim()
		.optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;

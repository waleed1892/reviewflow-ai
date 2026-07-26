import z from "zod";

export const createOrganizationSchema = z.object({
	name: z.string("Organization name is required").min(2).max(50).trim(),
});

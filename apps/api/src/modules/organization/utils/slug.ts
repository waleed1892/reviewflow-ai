import crypto from "node:crypto";
import slugify from "slugify";

export const generateSlug = (name: string): string => {
	const baseSlug = slugify(name, {
		lower: true,
		trim: true,
		strict: true,
	});

	const randomSuffix = crypto.randomBytes(32).toString("hex");

	return `${baseSlug}-${randomSuffix}`;
};

import type { ZodError } from "zod";

export interface FormattedZodError {
	field: string;
	message: string;
}

/**
 * Formats Zod validation errors into a clean, human-readable list of field error objects.
 */
export function formatZodError(error: ZodError): FormattedZodError[] {
	return error.issues.map((issue) => {
		const field = issue.path.length > 0 ? issue.path.join(".") : "body";
		const message =
			issue.path.length === 0 && issue.code === "invalid_type"
				? "Request body is required and must be a valid JSON object"
				: issue.message;

		return { field, message };
	});
}

import { Prisma } from "@reviewflow/database";

export interface FormattedPrismaError {
	code: string;
	message: string;
	details?: Record<string, unknown>;
	statusCode: number;
}

const PRISMA_ERROR_MAP: Record<
	string,
	{ code: string; message: string; statusCode: number }
> = {
	P2000: {
		code: "VALUE_TOO_LONG",
		message: "A field value exceeds the maximum allowed length",
		statusCode: 400,
	},
	P2002: {
		code: "UNIQUE_CONSTRAINT",
		message: "A record with the given unique fields already exists",
		statusCode: 409,
	},
	P2003: {
		code: "FOREIGN_KEY_CONSTRAINT",
		message: "Referenced record does not exist",
		statusCode: 409,
	},
	P2004: {
		code: "CONSTRAINT_FAILED",
		message: "A database constraint was violated",
		statusCode: 400,
	},
	P2014: {
		code: "RELATION_VIOLATION",
		message: "The required relation is violated",
		statusCode: 409,
	},
	P2015: {
		code: "RELATED_RECORD_NOT_FOUND",
		message: "A related record could not be found",
		statusCode: 404,
	},
	P2025: {
		code: "NOT_FOUND",
		message: "Requested record not found",
		statusCode: 404,
	},
};

const ERROR_STATUS_MAP = {
	FORBIDDEN: 403,
	DATABASE_VALIDATION_ERROR: 400,
	DATABASE_INITIALIZATION_ERROR: 503,
	DATABASE_PANIC: 500,
	DATABASE_UNKNOWN_ERROR: 500,
	DATABASE_ERROR: 500,
} as const;

export function formatPrismaError(error: unknown): FormattedPrismaError | null {
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		const mapped = PRISMA_ERROR_MAP[error.code];

		if (mapped) {
			const details: Record<string, unknown> = {};

			if (error.meta) {
				if (error.code === "P2002" && Array.isArray(error.meta.target)) {
					details.fields = error.meta.target;
				}
				if (
					error.code === "P2003" &&
					typeof error.meta.field_name === "string"
				) {
					details.field = error.meta.field_name;
				}
			}

			const hasDetails = Object.keys(details).length > 0;
			return {
				code: mapped.code,
				message: mapped.message,
				statusCode: mapped.statusCode,
				...(hasDetails && { details }),
			};
		}

		if (error.message.includes("row-level security")) {
			return {
				code: "FORBIDDEN",
				message: "You do not have permission to perform this action",
				statusCode: ERROR_STATUS_MAP.FORBIDDEN,
			};
		}

		const prismaCode = "DATABASE_ERROR";
		return {
			code: prismaCode,
			message: `Database request error: ${error.message}`,
			statusCode: ERROR_STATUS_MAP[prismaCode],
		};
	}

	if (error instanceof Prisma.PrismaClientValidationError) {
		const code = "DATABASE_VALIDATION_ERROR";
		return {
			code,
			message: "Invalid data was provided to the database query",
			statusCode: ERROR_STATUS_MAP[code],
		};
	}

	if (error instanceof Prisma.PrismaClientInitializationError) {
		const code = "DATABASE_INITIALIZATION_ERROR";
		return {
			code,
			message: "Failed to connect to the database",
			statusCode: ERROR_STATUS_MAP[code],
		};
	}

	if (error instanceof Prisma.PrismaClientUnknownRequestError) {
		const code = "DATABASE_UNKNOWN_ERROR";
		return {
			code,
			message: "An unknown database error occurred",
			statusCode: ERROR_STATUS_MAP[code],
		};
	}

	if (error instanceof Prisma.PrismaClientRustPanicError) {
		const code = "DATABASE_PANIC";
		return {
			code,
			message: "A critical database engine error occurred",
			statusCode: ERROR_STATUS_MAP[code],
		};
	}

	return null;
}

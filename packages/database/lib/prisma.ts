import "dotenv/config";
import { AsyncLocalStorage } from "node:async_hooks";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
	adapter,
	omit: {
		user: {
			password_hash: true,
		},
	},
});

export const orgContext = new AsyncLocalStorage<string>();

export const tenantPrisma = prisma.$extends({
	query: {
		$allModels: {
			async $allOperations({ args, query }) {
				const organizationId = orgContext.getStore();
				if (!organizationId) {
					return query(args);
				}
				const [, result] = await prisma.$transaction([
					prisma.$executeRaw`SELECT set_config('app.organization_id', ${organizationId}, true);`,
					query(args),
				]);
				return result;
			},
		},
	},
});

export { prisma };

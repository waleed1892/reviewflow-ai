import { prisma } from "./prisma";

export const getTenantClient = (organizationId: string) => {
	return prisma.$extends({
		query: {
			$allModels: {
				async $allOperations({ args, query }) {
					// Set PostgreSQL session variable for current connection
					const result = await prisma.$transaction([
						prisma.$executeRaw`SELECT set_config('app.current_organization_id', ${organizationId}, true);`,
						query(args),
					]);
					return result[1];
				},
			},
		},
	});
};

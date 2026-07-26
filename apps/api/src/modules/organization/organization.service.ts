import { type Prisma, Role } from "@reviewflow/database";
import { generateSlug } from "./utils/slug";

export class OrganizationService {
	public createOrganization = async (
		tx: Prisma.TransactionClient,
		params: {
			userId: string;
			name: string;
		},
	) => {
		const slug = generateSlug(params.name);

		const organization = await tx.organization.create({
			data: {
				name: params.name,
				slug: slug,
			},
		});

		const member = await tx.organizationMember.create({
			data: {
				user_id: params.userId,
				organization_id: organization.id,
				role: Role.OWNER,
			},
		});

		return { organization, member };
	};
}

export const organizationService = new OrganizationService();

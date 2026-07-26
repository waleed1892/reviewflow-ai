import type {
	Organization,
	OrganizationMember,
	User,
} from "@reviewflow/database";
import { organizationMemberSerializer } from "./organization-member.serializer";

type MemberWithUser = OrganizationMember & {
	user?: Omit<User, "password_hash">;
};

export const organizationSerializer = (
	organization: Organization & {
		members?: MemberWithUser[];
	},
	member?: MemberWithUser,
) => {
	return {
		id: organization.id,
		name: organization.name,
		slug: organization.slug,
		created_at: organization.created_at,
		updated_at: organization.updated_at,
		...(member && { member: organizationMemberSerializer(member) }),
		...(organization.members && {
			members: organization.members.map((m) => organizationMemberSerializer(m)),
		}),
	};
};

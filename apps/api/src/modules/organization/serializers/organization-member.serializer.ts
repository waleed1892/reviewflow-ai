import type { OrganizationMember, User } from "@reviewflow/database";
import { userSerializer } from "../../user/user.serializer";

type MemberInput = OrganizationMember & {
	user?: Omit<User, "password_hash">;
};

export const organizationMemberSerializer = (
	member: MemberInput,
): OrganizationMember => {
	return {
		role: member.role,
		id: member.id,
		organization_id: member.organization_id,
		created_at: member.created_at,
		updated_at: member.updated_at,
		user_id: member.user_id,
		...(member.user && { user: userSerializer(member.user) }),
	};
};

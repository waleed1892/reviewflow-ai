import type {
	Organization,
	OrganizationMember,
	User,
} from "@reviewflow/database";
import { organizationSerializer } from "../organization/serializers/organization.serializer";
import { userSerializer } from "../user/user.serializer";

export const serializeRegisterResponse = (params: {
	user: User;
	organization: Organization;
	member: OrganizationMember;
}) => {
	return {
		user: userSerializer(params.user),
		organization: organizationSerializer(params.organization, params.member),
	};
};

export const serializeLoginResponse = (params: {
	user: User;
	access_token: string;
	refresh_token: string;
}) => {
	return {
		user: userSerializer(params.user),
		access_token: params.access_token,
		refresh_token: params.refresh_token,
	};
};

import type { User } from "@reviewflow/database";

export const userSerializer = (
	user: Omit<User, "password_hash">,
): Partial<User> => {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		created_at: user.created_at,
		updated_at: user.updated_at,
	};
};

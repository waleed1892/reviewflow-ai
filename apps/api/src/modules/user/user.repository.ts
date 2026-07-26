import { prisma } from "@reviewflow/database";

export class UserRepository {
	constructor(private readonly db = prisma) {}

	public findById = async (id: string) => {
		return await this.db.user.findUniqueOrThrow({
			where: {
				id,
			},
		});
	};

	public findByEmailForLogin = async (email: string) => {
		return await this.db.user.findUniqueOrThrow({
			where: {
				email,
			},
			select: {
				id: true,
				name: true,
				email: true,
				created_at: true,
				updated_at: true,
				password_hash: true,
			},
		});
	};
}

export const userRepository = new UserRepository();

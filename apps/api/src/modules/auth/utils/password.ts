import { argon2id, hash, verify } from "argon2";

export const hashPassword = async (password: string): Promise<string> => {
	return hash(password, {
		type: argon2id,
		memoryCost: 2 ** 16, // 65536 = 64MB
		parallelism: 1,
		timeCost: 3,
	});
};

export const verifyPassword = async (
	plainText: string,
	hash: string,
): Promise<boolean> => {
	try {
		return await verify(hash, plainText);
	} catch {
		return false;
	}
};

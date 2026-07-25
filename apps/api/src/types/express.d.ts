export interface AuthUser {
	id: string;
	sid: string;
}

declare global {
	namespace Express {
		interface Request {
			user?: AuthUser;
		}
	}
}

import { loginSchema, registerSchema } from "@reviewflow-ai/shared";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AUTH_COOKIES } from "./auth.constants";
import { authService } from "./auth.service";
import { clearAuthCookies, setAuthCookies } from "./utils/cookies";
import { getAuthMeta } from "./utils/meta";
import { getAuthUser } from "./utils/user";

export class AuthController {
	constructor(private readonly service = authService) {}

	public register = async (req: Request, res: Response) => {
		const body = registerSchema.parse(req.body);
		const user = await this.service.register(body);
		res.status(StatusCodes.CREATED).json({ data: user });
	};

	public login = async (req: Request, res: Response) => {
		const body = loginSchema.parse(req.body);
		const result = await this.service.login(body, getAuthMeta(req));

		setAuthCookies(res, result);

		res.status(StatusCodes.OK).json({ data: { user: result.user } });
	};

	public me = async (req: Request, res: Response) => {
		const authUser = getAuthUser(req);

		const user = await this.service.me(authUser.id);

		res.status(StatusCodes.OK).json({ data: user });
	};

	public refreshToken = async (req: Request, res: Response) => {
		const refreshToken = req.cookies?.[AUTH_COOKIES.REFRESH_TOKEN];
		if (!refreshToken) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ message: "Refresh token missing" });
		}

		const result = await this.service.refresh(refreshToken, getAuthMeta(req));

		setAuthCookies(res, result);

		res.status(StatusCodes.OK).json({ data: { user: result.user } });
	};

	public logout = async (req: Request, res: Response) => {
		const user = getAuthUser(req);
		await this.service.logout(user.sid);
		clearAuthCookies(res);

		res.status(StatusCodes.OK).json({
			message: "Logged out successfully",
		});
	};

	public logoutAll = async (req: Request, res: Response) => {
		const user = getAuthUser(req);
		await this.service.logoutAll(user.id);
		clearAuthCookies(res);

		res.status(StatusCodes.OK).json({
			message: "Logged out all devices successfully",
		});
	};
}

export const authController = new AuthController();

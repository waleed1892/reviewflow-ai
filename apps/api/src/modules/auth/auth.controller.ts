import { loginSchema, registerSchema } from "@reviewflow-ai/shared";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userSerializer } from "@/modules/user/user.serializer";
import { sendErrorResponse, sendSuccessResponse } from "@/utils/response";
import { AUTH_COOKIES } from "./auth.constants";
import {
	serializeLoginResponse,
	serializeRegisterResponse,
} from "./auth.serializer";
import { authService } from "./auth.service";
import { clearAuthCookies, setAuthCookies } from "./utils/cookies";
import { getAuthMeta } from "./utils/meta";
import { getAuthUser } from "./utils/user";

export class AuthController {
	constructor(private readonly service = authService) {}

	public register = async (req: Request, res: Response) => {
		const body = registerSchema.parse(req.body);
		const result = await this.service.register(body);

		sendSuccessResponse(
			res,
			serializeRegisterResponse(result),
			StatusCodes.CREATED,
		);
	};

	public login = async (req: Request, res: Response) => {
		const body = loginSchema.parse(req.body);
		const result = await this.service.login(body, getAuthMeta(req));

		setAuthCookies(res, result);

		sendSuccessResponse(res, serializeLoginResponse(result));
	};

	public me = async (req: Request, res: Response) => {
		const authUser = getAuthUser(req);

		const user = await this.service.me(authUser.id);

		sendSuccessResponse(res, userSerializer(user));
	};

	public refreshToken = async (req: Request, res: Response) => {
		const refreshToken = req.cookies?.[AUTH_COOKIES.REFRESH_TOKEN];
		if (!refreshToken) {
			return sendErrorResponse(
				res,
				"Refresh token missing",
				StatusCodes.UNAUTHORIZED,
			);
		}

		const result = await this.service.refresh(refreshToken, getAuthMeta(req));

		setAuthCookies(res, result);

		sendSuccessResponse(res, { user: result.user });
	};

	public logout = async (req: Request, res: Response) => {
		const user = getAuthUser(req);
		await this.service.logout(user.sid);
		clearAuthCookies(res);

		sendSuccessResponse(res, { message: "Logged out successfully" });
	};

	public logoutAll = async (req: Request, res: Response) => {
		const user = getAuthUser(req);
		await this.service.logoutAll(user.id);
		clearAuthCookies(res);

		sendSuccessResponse(res, {
			message: "Logged out all devices successfully",
		});
	};
}

export const authController = new AuthController();

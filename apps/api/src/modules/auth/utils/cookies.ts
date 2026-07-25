import type { Response } from "express";
import { AUTH_COOKIES, COOKIE_OPTIONS } from "../auth.constants";

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

/**
 * Sets both access_token and refresh_token HttpOnly cookies on the HTTP response.
 */
export function setAuthCookies(res: Response, tokens: AuthTokens): void {
	res.cookie(AUTH_COOKIES.ACCESS_TOKEN, tokens.accessToken, COOKIE_OPTIONS);
	res.cookie(AUTH_COOKIES.REFRESH_TOKEN, tokens.refreshToken, COOKIE_OPTIONS);
}

/**
 * Clears both access_token and refresh_token HttpOnly cookies from the browser.
 */
export function clearAuthCookies(res: Response): void {
	res.clearCookie(AUTH_COOKIES.ACCESS_TOKEN, COOKIE_OPTIONS);
	res.clearCookie(AUTH_COOKIES.REFRESH_TOKEN, COOKIE_OPTIONS);
}

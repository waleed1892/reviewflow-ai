import type { Response } from "express";
import { AUTH_COOKIES, COOKIE_OPTIONS } from "../auth.constants";

export interface AuthTokens {
	access_token: string;
	refresh_token: string;
}

/**
 * Sets both access_token and refresh_token HttpOnly cookies on the HTTP response.
 */
export function setAuthCookies(res: Response, tokens: AuthTokens): void {
	res.cookie(AUTH_COOKIES.ACCESS_TOKEN, tokens.access_token, COOKIE_OPTIONS);
	res.cookie(AUTH_COOKIES.REFRESH_TOKEN, tokens.refresh_token, COOKIE_OPTIONS);
}

/**
 * Clears both access_token and refresh_token HttpOnly cookies from the browser.
 */
export function clearAuthCookies(res: Response): void {
	res.clearCookie(AUTH_COOKIES.ACCESS_TOKEN, COOKIE_OPTIONS);
	res.clearCookie(AUTH_COOKIES.REFRESH_TOKEN, COOKIE_OPTIONS);
}

import type { IncomingMessage } from "node:http";
import { parse, serialize } from "cookie";
import { SessionConfig } from "./session.config";

export function clearAppSessionCookie(): string {
	return serialize(SessionConfig.cookieName, "", {
		httpOnly: true,
		path: "/",
		sameSite: "lax",
		maxAge: 0,
		secure: SessionConfig.cookieSecure,
		domain: SessionConfig.cookieDomain || undefined,
	});
}

export function getAppSessionToken(req: IncomingMessage): string | null {
	const cookieHeader = req.headers.cookie;
	if (!cookieHeader) return null;

	const cookies = parse(req.headers.cookie || "");

	return cookies[SessionConfig.cookieName] ?? null;
}

export function setAppSessionCookie(sessionId: string): string {
	return serialize(SessionConfig.cookieName, sessionId, {
		httpOnly: true,
		path: "/",
		sameSite: SessionConfig.cookieSameSite,
		maxAge: SessionConfig.maxAge,
		secure: SessionConfig.cookieSecure,
		domain: SessionConfig.cookieDomain || undefined,
	});
}

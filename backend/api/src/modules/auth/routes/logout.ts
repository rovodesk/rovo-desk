import { api } from "encore.dev/api";
import { AuthConfig } from "@/src/modules/auth/auth.config";
import {
	clearAppSessionCookie,
	getAppSessionToken,
} from "@/src/modules/session/utils";
import { session } from "~encore/clients";

export const logout = api.raw(
	{
		method: "GET",
		path: "/auth/logout",
		expose: true,
	},
	async (req, res) => {
		const sessionId = getAppSessionToken(req);

		if (sessionId) {
			try {
				await session.revokeSession({ sessionId });
			} catch (error) {
				console.error("Failed to revoke app session during logout:", error);
			}
		}

		const logoutUrl = new URL(`${AuthConfig.cognitoDomain}/logout`);
		logoutUrl.searchParams.set("client_id", AuthConfig.clientId);
		logoutUrl.searchParams.set("logout_uri", AuthConfig.postLogoutRedirect);

		res.writeHead(302, {
			Location: logoutUrl.toString(),
			"Set-Cookie": clearAppSessionCookie(),
			"Cache-Control": "no-store",
			Pragma: "no-cache",
		});

		res.end();
	}
);

export const logoutCallback = api.raw(
	{
		method: "GET",
		path: "/auth/logout/callback",
		expose: true,
	},
	async (_req, res) => {
		const redirectUrl = new URL(AuthConfig.postLogoutRedirect);

		res.writeHead(302, {
			Location: redirectUrl.toString(),
			"Set-Cookie": clearAppSessionCookie(),
			"Cache-Control": "no-store",
			Pragma: "no-cache",
		});

		res.end();
	}
);

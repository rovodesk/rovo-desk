import { createRemoteJWKSet, jwtVerify } from "jose";
import type { AuthJWTPayload } from "./types";

const JWKS = createRemoteJWKSet(
	new URL(
		`${process.env.BETTER_AUTH_URL}/${process.env.BETTER_AUTH_BASE_PATH}/.well-known/jwks.json`
	)
);

export async function validateJWTToken(
	token: string
): Promise<AuthJWTPayload | null> {
	try {
		const { payload } = await jwtVerify(token, JWKS, {
			issuer: process.env.BETTER_AUTH_URL,
			requiredClaims: ["id", "email", "role", "verified", "deleted"],
		});
		return payload as unknown as AuthJWTPayload;
	} catch (error) {
		console.error("Token validation failed:", error);
		return null;
	}
}

export function getJwtFromRequest(request: Request) {
	const header = request.headers.get("Set-Auth-Jwt");
	if (header) return header;

	const cookie = request.headers.get("cookie") ?? "";
	const match = cookie.match(/better-auth=([^;]+)/);

	return match?.[1] ?? null;
}

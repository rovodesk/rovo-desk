import { createRemoteJWKSet, decodeJwt, jwtVerify } from "jose";

export type JwtPayload = {
	sub: string;
	iss: string;
	aud: string | string[];
	exp: number;
	iat: number;
	email?: string;
	org_code?: string;
	permissions?: string[];
	roles?: string[];
	[K: string]: unknown;
};

export function createJWKSUrl(domain: string) {
	const normalizedDomain = domain.startsWith("http")
		? domain
		: `https://${domain}`;

	return createRemoteJWKSet(
		new URL(`${normalizedDomain}/.well-known/jwks.json`)
	);
}

export async function verifyJWTToken(
	token: string,
	opts: {
		domain: string;
		audience?: string;
		issuer?: string;
	}
): Promise<JwtPayload> {
	const normalizedDomain = opts.domain.startsWith("http")
		? opts.domain
		: `https://${opts.domain}`;

	const JWKS = createJWKSUrl(normalizedDomain);

	const issuer = opts.issuer ?? normalizedDomain;

	const { payload } = await jwtVerify(token, JWKS, {
		issuer,
		audience: opts.audience ?? normalizedDomain,
	});

	return payload as JwtPayload;
}

export function decodeJwtToken(token: string): JwtPayload {
	return decodeJwt(token) as JwtPayload;
}

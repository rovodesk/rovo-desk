import { createRemoteJWKSet, decodeJwt, jwtVerify } from "jose";

export type KindeJwtPayload = {
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

export function createKindeJWKS(domain: string) {
	const normalizedDomain = domain.startsWith("http")
		? domain
		: `https://${domain}`;

	return createRemoteJWKSet(new URL(`${normalizedDomain}/.well-known/jwks`));
}

export async function verifyKindeAccessToken(
	token: string,
	opts: {
		domain: string;
		audience: string;
		issuer?: string;
	}
): Promise<KindeJwtPayload> {
	const normalizedDomain = opts.domain.startsWith("http")
		? opts.domain
		: `https://${opts.domain}`;

	const JWKS = createKindeJWKS(normalizedDomain);

	const issuer = opts.issuer ?? normalizedDomain;

	const { payload } = await jwtVerify(token, JWKS, {
		issuer,
		audience: opts.audience,
	});

	return payload as KindeJwtPayload;
}

export function decodeJwtToken(token: string): KindeJwtPayload {
	return decodeJwt(token) as KindeJwtPayload;
}

import crypto from "crypto";
import { decodeJwt, type JWTVerifyOptions, jwtVerify, SignJWT } from "jose";
import type { JWTPayload } from "types";

export async function signJWTToken<T extends JWTPayload>(
	payload: T,
	secret: string,
	expiry: string,
	iss: string,
	sub: string,
	aud: string | string[]
): Promise<string> {
	const secretKey = new TextEncoder().encode(secret);

	return await new SignJWT({ ...payload })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuer(iss)
		.setSubject(sub)
		.setAudience(aud)
		.setJti(crypto.randomUUID())
		.setIssuedAt()
		.setExpirationTime(expiry)
		.sign(secretKey);
}

export async function verifyJWTToken<T extends JWTPayload>(
	token: string,
	secret: string,
	options?: Omit<JWTVerifyOptions, "algorithms">
): Promise<T> {
	const secretKey = new TextEncoder().encode(secret);

	try {
		const { payload } = await jwtVerify(token, secretKey, {
			algorithms: ["HS256"],
			...options,
		});

		return payload as T; // Typed Payload
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export function decodeJwtToken(token: string): JWTPayload {
	return decodeJwt(token);
}

////// UTILITIES

export async function issueAnonymousSDKToken(
	orgId: string,
	masterSecret: string
): Promise<string> {
	return await signJWTToken(
		{
			keyId: crypto.randomUUID(),
			orgId,
			role: "anonymous",
		},
		masterSecret,
		"15m",
		"http://localhost:5001",
		"",
		`organization:${orgId},role:anonymous`
	);
}

export async function issueAuthenticatedSDKToken(
	orgId: string,
	user: Record<string, unknown>,
	masterSecret: string
): Promise<string> {
	return await signJWTToken(
		{
			keyId: crypto.randomUUID(),
			orgId,
			user,
			role: "authenticated",
		},
		masterSecret,
		"30m",
		"http://localhost:5001",
		user.id as string,
		`organization:${orgId},user:${user.id},role:authenticated`
	);
}

export async function issueAiToken(
	orgId: string,
	connectionId: string,
	masterSecret: string
): Promise<[string, number]> {
	const token = await signJWTToken(
		{
			keyId: crypto.randomUUID(),
			orgId,
			connectionId,
			role: "ai",
		},
		masterSecret,
		"1d",
		"http://localhost:3000",
		connectionId,
		`organization:${orgId},connection:${connectionId},role:ai`
	);

	return [token, 1 * 60 * 60 * 24];
}

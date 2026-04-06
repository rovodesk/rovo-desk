import crypto from "node:crypto";
import {
	AuthFlowType,
	ChallengeNameType,
	CognitoIdentityProviderClient,
	InitiateAuthCommand,
	RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { APIError } from "encore.dev/api";
import { z } from "zod";
import { AuthConfig } from "./config";

export const cognito = new CognitoIdentityProviderClient({
	region: AuthConfig.region,
});

export function secretHash(username: string): string | undefined {
	const clientSecret = AuthConfig.clientSecret;
	if (!clientSecret) return undefined;

	return crypto
		.createHmac("sha256", clientSecret)
		.update(username + AuthConfig.clientId)
		.digest("base64");
}

export async function initiateEmailOTPAuth(email: string) {
	const authParams: Record<string, string> = {
		USERNAME: email,
		PREFERRED_CHALLENGE: ChallengeNameType.EMAIL_OTP,
	};

	const sh = secretHash(email);
	if (sh) authParams.SECRET_HASH = sh;

	const command = new InitiateAuthCommand({
		ClientId: AuthConfig.clientId,
		AuthFlow: AuthFlowType.USER_AUTH,
		AuthParameters: authParams,
	});

	return await cognito.send(command);
}

export async function respondToEmailOTPChallenge(params: {
	email: string;
	emailOTP: string;
	session: string;
}) {
	const challengeResponses: Record<string, string> = {
		USERNAME: params.email,
		EMAIL_OTP_CODE: params.emailOTP,
	};

	const sh = secretHash(params.email);
	if (sh) challengeResponses.SECRET_HASH = sh;

	return await cognito.send(
		new RespondToAuthChallengeCommand({
			ClientId: AuthConfig.clientId,
			ChallengeName: ChallengeNameType.EMAIL_OTP,
			Session: params.session,
			ChallengeResponses: challengeResponses,
		})
	);
}

const tokenSchema = z.object({
	id_token: z.string(),
	access_token: z.string(),
	refresh_token: z.string().optional(),
	expires_in: z.coerce.number(),
	token_type: z.literal("Bearer"),
});

export async function exchangeCodeForTokens(params: {
	code: string;
	codeVerifier: string;
}) {
	const body = new URLSearchParams({
		grant_type: "authorization_code",
		client_id: AuthConfig.clientId,
		code: params.code,
		redirect_uri: AuthConfig.callbackUrl,
		code_verifier: params.codeVerifier,
	});

	const clientSecret = AuthConfig.clientSecret;
	if (clientSecret) {
		body.set("client_secret", clientSecret);
	}

	const res = await fetch(`${AuthConfig.cognitoDomain}/oauth2/token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body,
	});

	const rawData = await res.json();
	if (!res.ok) {
		console.error("Failed exchanging OAuth code:", rawData);
		throw APIError.internal("Failed exchanging OAuth codes");
	}

	const parsed = tokenSchema.safeParse(rawData);
	if (!parsed.success) {
		console.error("Token schema mismatch:", z.treeifyError(parsed.error));
		console.error("Raw token response:", rawData);
		throw APIError.internal("Token Response Mismatch");
	}

	const data = parsed.data;

	return {
		accessToken: data.access_token,
		idToken: data.id_token,
		refreshToken: data.refresh_token,
		expiresIn: data.expires_in,
		tokenType: data.token_type,
	};
}

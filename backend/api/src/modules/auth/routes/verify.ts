import {
	parseJwt,
	respondToEmailOTPChallenge,
} from "@zero-heads-lab/auth/server";
import {
	type VerifyEmailOTPRequest,
	type VerifyEmailOTPResponse,
	verifyEmailOTPRequestSchema,
	verifyEmailOTPResponseSchema,
} from "@zero-heads-lab/shared/contracts";
import { APIError, api } from "encore.dev/api";
import { z } from "zod";
import { session, user } from "~encore/clients";

export const verifyEmailOTP = api<
	VerifyEmailOTPRequest,
	VerifyEmailOTPResponse
>(
	{
		method: "POST",
		path: "/auth/login/email-otp/verify",
		expose: true,
	},
	async (req) => {
		// Parse the Request
		const parsed = verifyEmailOTPRequestSchema.safeParse(req);
		if (!parsed.success) {
			throw APIError.invalidArgument("Invalid login token or OTP code");
		}

		// Get AccessToken and code
		const { loginToken, code } = parsed.data;

		// Get the user Anonymous Session
		const login = await session.getAnonymousSession({
			accessToken: loginToken,
		});
		if (!login.session) {
			throw APIError.unauthenticated("Login session expired or invalid");
		}

		const result = await respondToEmailOTPChallenge({
			email: login.session.email,
			emailOTP: code,
			session: login.session.cognitoSession,
		});

		const auth = result.AuthenticationResult;

		if (!(auth?.IdToken && auth?.AccessToken)) {
			throw APIError.unauthenticated("Invalid OTP");
		}

		// GET USER CLAIMS
		const claims = parseJwt(auth.IdToken);
		console.log(claims);

		const localUser = await user.ensureUserExists({
			authProvider: "cognito",
			authUserId: claims.sub,
			email: claims.email,
			name: claims.name,
			emailVerified: claims.email_verified ?? true,
		});

		await session.revokeAnonymousSession({
			accessToken: loginToken,
		});

		const verifyEmailOTPResponse = verifyEmailOTPResponseSchema.safeParse({
			userId: localUser.id,
			accessToken: auth.AccessToken,
			idToken: auth.IdToken,
			refreshToken: auth.RefreshToken,
		});
		if (!verifyEmailOTPResponse.success) {
			console.error(
				"Failed to create email OTP session",
				z.treeifyError(verifyEmailOTPResponse.error).errors.join(", ")
			);
			throw APIError.internal("Failed to create email OTP session");
		}

		return verifyEmailOTPResponse.data;
	}
);

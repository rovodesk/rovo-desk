import crypto from "node:crypto";
import { APIError, api } from "encore.dev/api";
import { z } from "zod";
import type { AnonymousSession } from "@/src/modules/session/types";
import { session, user } from "~encore/clients";
import { initiateEmailOTPAuth, respondToEmailOTPChallenge } from "../cognito";
import { parseJwt } from "../utils";

const createEmailOTPSessionSchema = z.object({
	email: z.email(),
	cognitoSession: z.string().min(1),
	challengeName: z.string().optional(),
});

interface CreateEmailOTPSessionRequest {
	email: string;
	cognitoSession: string;
	challengeName?: string;
}

interface CreateEmailOTPSessionResponse {
	success: true;
	loginToken: string;
	expiresInSeconds: number;
}

export const createEmailOTPSession = api<
	CreateEmailOTPSessionRequest,
	CreateEmailOTPSessionResponse
>(
	{
		method: "POST",
		path: "/auth/login/email-otp/session",
		expose: false,
	},
	async (req) => {
		const parsed = createEmailOTPSessionSchema.safeParse(req);

		if (!parsed.success) {
			throw APIError.invalidArgument("Invalid email OTP session payload");
		}

		const { email, cognitoSession, challengeName } = parsed.data;

		const loginToken = crypto.randomUUID();
		const now = new Date();

		const anonSession: AnonymousSession = {
			accessToken: loginToken,
			email,
			cognitoSession,
			challengeName: challengeName ?? null,
			createdAt: now.toISOString(),
		};

		await session.createAnonymousSession(anonSession);

		return {
			success: true,
			loginToken,
			expiresInSeconds: 10 * 60,
		};
	}
);

const loginEmailOTPSchema = z.object({
	email: z.email(),
});

interface LoginEmailOTPRequest {
	email: string;
}

interface LoginEmailOTPResponse {
	success: true;
	loginToken: string;
	challenge: string;
}

export const loginEmailOTP = api<LoginEmailOTPRequest, LoginEmailOTPResponse>(
	{
		method: "POST",
		path: "/auth/login/email-otp",
		expose: true,
	},
	async (req) => {
		const parsed = loginEmailOTPSchema.safeParse(req);

		if (!parsed.success) {
			throw APIError.invalidArgument("Invalid email");
		}

		const { email } = parsed.data;

		// FIXED: pass string, not object
		const result = await initiateEmailOTPAuth(email);

		if (!result.Session) {
			throw APIError.internal("Failed to initiate email OTP login");
		}

		const anon = await createEmailOTPSession({
			email,
			cognitoSession: result.Session,
			challengeName: result.ChallengeName ?? "EMAIL_OTP",
		});

		return {
			success: true,
			loginToken: anon.loginToken,
			challenge: result.ChallengeName ?? "EMAIL_OTP",
		};
	}
);

const verifyEmailOTPSchema = z.object({
	loginToken: z.uuid(),
	code: z.string().min(6),
});

interface VerifyEmailOTPRequest {
	loginToken: string;
	code: string;
}

interface VerifyEmailOTPResponse {
	success: true;
	userId: string;
	accessToken: string;
	idToken: string;
	refreshToken?: string;
}

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
		const parsed = verifyEmailOTPSchema.safeParse(req);
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
			// FIXME
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

		return {
			success: true,
			userId: localUser.id,
			accessToken: auth.AccessToken,
			idToken: auth.IdToken,
			refreshToken: auth.RefreshToken,
		};
	}
);

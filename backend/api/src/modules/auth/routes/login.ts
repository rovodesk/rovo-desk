import crypto from "node:crypto";
import { initiateEmailOTPAuth } from "@zero-heads-lab/auth/server";
import type { AnonymousSession } from "@zero-heads-lab/auth/types";
import {
	type CreateEmailOTPSessionRequest,
	type CreateEmailOTPSessionResponse,
	createEmailOTPSessionRequestSchema,
	createEmailOTPSessionResponseSchema,
	type LoginEmailOTPRequest,
	type LoginEmailOTPResponse,
	loginEmailOTPRequestSchema,
	loginEmailOTPResponseSchema,
} from "@zero-heads-lab/shared/contracts";
import { APIError, api } from "encore.dev/api";
import { z } from "zod";
import { session } from "~encore/clients";

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
		const parsed = createEmailOTPSessionRequestSchema.safeParse(req);

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

		const createEmailOTPSessionResponse =
			createEmailOTPSessionResponseSchema.safeParse({
				loginToken,
				expiresInSeconds: 10 * 60,
			});
		if (!createEmailOTPSessionResponse.success) {
			console.error(
				"Failed to create email OTP session",
				z.treeifyError(createEmailOTPSessionResponse.error).errors.join(", ")
			);
			throw APIError.internal("Failed to create email OTP session");
		}

		return createEmailOTPSessionResponse.data;
	}
);

export const loginEmailOTP = api<LoginEmailOTPRequest, LoginEmailOTPResponse>(
	{
		method: "POST",
		path: "/auth/login/email-otp",
		expose: true,
	},
	async (req) => {
		const parsed = loginEmailOTPRequestSchema.safeParse(req);
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

		const loginEmailOTPResponse = loginEmailOTPResponseSchema.safeParse({
			loginToken: anon.loginToken,
			challenge: result.ChallengeName ?? "EMAIL_OTP",
		});
		if (!loginEmailOTPResponse.success) {
			console.error(
				"Failed to create email OTP session",
				z.treeifyError(loginEmailOTPResponse.error).errors.join(", ")
			);
			throw APIError.internal("Failed to create email OTP session");
		}

		return loginEmailOTPResponse.data;
	}
);

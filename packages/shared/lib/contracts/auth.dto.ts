import { z } from "zod";

export const createEmailOTPSessionRequestSchema = z.object({
	email: z.email(),
	cognitoSession: z.string().min(1),
	challengeName: z.string().optional(),
});

export interface CreateEmailOTPSessionRequest {
	email: string;
	cognitoSession: string;
	challengeName?: string;
}

export const createEmailOTPSessionResponseSchema = z.object({
	loginToken: z.uuid(),
	expiresInSeconds: z.number(),
});

export interface CreateEmailOTPSessionResponse {
	loginToken: string;
	expiresInSeconds: number;
}

export const providerSchema = z.enum(["google", "github", "linear"]);

export const oauthCallbackRequestSchema = z.object({
	provider: providerSchema.optional(),
	code: z.string().optional(),
	state: z.string().optional(),
	error: z.string().optional(),
	error_description: z.string().optional(),
});

export interface OauthCallbackRequest {
	provider?: string;
	code?: string;
	state?: string;
	error?: string;
	error_description?: string;
}

export const oauthCallbackResponseSchema = z.object({
	provider: providerSchema.optional(),
	redirectTo: z.string(),
	userId: z.string(),
});

export interface OauthCallbackResponse {
	provider?: string;
	redirectTo: string;
	userId: string;
}

export const loginEmailOTPRequestSchema = z.object({
	email: z.email(),
});

export interface LoginEmailOTPRequest {
	email: string;
}

export const loginEmailOTPResponseSchema = z.object({
	loginToken: z.uuid(),
	challenge: z.string(),
});

export interface LoginEmailOTPResponse {
	loginToken: string;
	challenge: string;
}

export const verifyEmailOTPRequestSchema = z.object({
	loginToken: z.uuid(),
	code: z.string().min(6),
});

export interface VerifyEmailOTPRequest {
	loginToken: string;
	code: string;
}

export const verifyEmailOTPResponseSchema = z.object({
	userId: z.string(),
	accessToken: z.string(),
	idToken: z.string(),
	refreshToken: z.string().optional(),
});

export interface VerifyEmailOTPResponse {
	userId: string;
	accessToken: string;
	idToken: string;
	refreshToken?: string;
}

export const loginViaSocialRequestSchema = z.object({
	provider: z.enum(["google", "github", "linear"]).default("google"),
	returnTo: z.url().optional().nullable().or(z.literal("")),
});

export interface LoginViaSocialRequest {
	provider?: string;
	returnTo?: string | null;
}

export const loginViaSocialResponseSchema = z.object({
	authorizeUrl: z.url(),
});

export interface LoginViaSocialResponse {
	authorizeUrl: string;
}

export const createAnonymousSessionRequestSchema = z.object({
	accessToken: z.uuid(),
	email: z.email(),
	cognitoSession: z.string().min(1),
	challengeName: z.string().optional().nullable(),
	createdAt: z.iso.datetime(),
});

export interface CreateAnonymousSessionRequest {
	accessToken: string;
	email: string;
	cognitoSession: string;
	challengeName?: string | null;
	createdAt: string;
}

export const createAnonymousSessionResponseSchema = z.object({
	success: z.literal(true),
});

export interface CreateAnonymousSessionResponse {
	success: true;
}

export const getSessionRequestSchema = z.object({
	sessionId: z.uuid(),
});

export interface GetSessionRequest {
	sessionId: string;
}

export const getSessionResponseSchema = z.object({
	authenticated: z.boolean(),
	user: z
		.object({
			id: z.string(),
			email: z.string().nullable(),
			name: z.string().nullable(),
			provider: z.string().nullable(),
		})
		.nullable(),
	session: z
		.object({
			sessionId: z.string(),
			createdAt: z.iso.datetime(),
			lastSeenAt: z.iso.datetime(),
			mfaVerified: z.boolean(),
		})
		.nullable(),
});

export interface GetSessionResponse {
	authenticated: boolean;
	user: {
		id: string;
		email: string | null;
		name: string | null;
		provider: string | null;
	} | null;
	session: {
		sessionId: string;
		createdAt: string;
		lastSeenAt: string;
		mfaVerified: boolean;
	} | null;
}

export const revokeAnonymousSessionRequestSchema = z.object({
	accessToken: z.uuid(),
});

export const revokeAnonymousSessionResponseSchema = z.object({
	success: z.literal(true),
});

export interface RevokeAnonymousSessionRequest {
	accessToken: string;
}

export interface RevokeAnonymousSessionResponse {
	success: true;
}

export const revokeSessionRequestSchema = z.object({
	sessionId: z.uuid(),
});

export interface RevokeSessionRequest {
	sessionId: string;
}

export const revokeSessionResponseSchema = z.object({
	success: z.literal(true),
});

export interface RevokeSessionResponse {
	success: true;
}

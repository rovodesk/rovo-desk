import z from "zod";

export const createEmailOTPRequestSessionSchema = z.object({
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

export const loginViaSocialRequestSchema = z.object({
	provider: z.enum(["google", "github", "linear"]).default("google"),
	returnTo: z.string().optional(),
});

export interface LoginViaSocialRequest {
	provider?: string;
	returnTo?: string;
}

export const loginViaSocialResponseSchema = z.object({
	authorizeUrl: z.string(),
});

export interface LoginViaSocialResponse {
	authorizeUrl: string;
}

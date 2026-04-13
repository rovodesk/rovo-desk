import z from "zod";

export const verifyEmailOTPRequestSchema = z.object({
	loginToken: z.uuid(),
	code: z.string().min(6),
});

export interface VerifyEmailOTPRequest {
	loginToken: string;
	code: string;
}

export const verifyEmailOTPResponseSchema = z.object({
	userId: z.uuid(),
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

import { APIError, api } from "encore.dev/api";
import { z } from "zod";
import { AuthConfig } from "@/src/modules/auth/auth.config";
import { handleOAuthCallback } from "../oauth";

const providerSchema = z.enum(["google", "github", "linear"]);

interface OAuthCallbackRequest {
	code?: string;
	state?: string;
	error?: string;
	error_description?: string;
}

interface OAuthCallbackResponse {
	success: true;
	provider?: string;
	redirectTo: string;
	userId: string;
}

export const oauthCallback = api<OAuthCallbackRequest, OAuthCallbackResponse>(
	{
		expose: true,
		method: "GET",
		path: "/auth/callback",
	},
	async (req) => {
		if (req.error) {
			throw APIError.unauthenticated(
				req.error_description || `OAuth error: ${req.error}`
			);
		}

		if (!(req.code && req.state)) {
			throw APIError.invalidArgument("Missing OAuth code or state");
		}

		const result = await handleOAuthCallback({
			code: req.code,
			state: req.state,
		});

		return {
			success: true,
			provider: result.provider,
			redirectTo: result.returnTo ?? AuthConfig.postLoginRedirect,
			userId: result.localUser.id,
		};
	}
);

interface OAuthProviderCallbackRequest {
	provider: string;
	code?: string;
	state?: string;
	error?: string;
	error_description?: string;
}

interface OAuthProviderCallbackResponse {
	success: true;
	provider: string;
	redirectTo: string;
	userId: string;
}

export const oauthProviderCallback = api<
	OAuthProviderCallbackRequest,
	OAuthProviderCallbackResponse
>(
	{
		expose: true,
		method: "GET",
		path: "/auth/callback/:provider",
	},
	async (req) => {
		const parsedProvider = providerSchema.safeParse(req.provider);

		if (!parsedProvider.success) {
			throw APIError.invalidArgument("Unsupported callback provider");
		}

		if (req.error) {
			throw APIError.unauthenticated(
				req.error_description || `OAuth error: ${req.error}`
			);
		}

		if (!(req.code && req.state)) {
			throw APIError.invalidArgument("Missing OAuth code or state");
		}

		const result = await handleOAuthCallback({
			provider: parsedProvider.data,
			code: req.code,
			state: req.state,
		});

		return {
			success: true,
			provider: result.provider ?? parsedProvider.data,
			redirectTo: result.returnTo ?? AuthConfig.postLoginRedirect,
			userId: result.localUser.id,
		};
	}
);

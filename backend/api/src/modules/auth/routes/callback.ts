import {
	createCodeChallenge,
	createCodeVerifier,
	createState,
	mapProviderToCognito,
	validateReturnTo,
} from "@zero-heads-lab/auth/helpers";
import {
	AuthConfig,
	type HandleOAuthCallbackDeps,
	handleOAuthCallback,
} from "@zero-heads-lab/auth/server";
import {
	type LoginViaSocialRequest,
	type LoginViaSocialResponse,
	loginViaSocialRequestSchema,
	loginViaSocialResponseSchema,
	type OauthCallbackRequest,
	type OauthCallbackResponse,
	oauthCallbackRequestSchema,
	oauthCallbackResponseSchema,
} from "@zero-heads-lab/shared/contracts";
import { APIError, api } from "encore.dev/api";
import z from "zod";
import { user } from "~encore/clients";
import { oauthStates } from "../cache";

const oauthDeps: HandleOAuthCallbackDeps = {
	userService: {
		ensureUserExists: user.ensureUserExists,
	},
	oauthStateStore: oauthStates,
};

export const oauthCallback = api<OauthCallbackRequest, OauthCallbackResponse>(
	{
		expose: true,
		method: "GET",
		path: "/auth/callback/:provider?", // ✅ optional param
	},
	async (req) => {
		const parsed = oauthCallbackRequestSchema.safeParse(req);

		if (!parsed.success) {
			throw APIError.invalidArgument("Invalid OAuth callback request");
		}

		const { error, error_description, code, state, provider } = parsed.data;

		if (error) {
			throw APIError.unauthenticated(
				error_description || `OAuth error: ${error}`
			);
		}

		if (!(code && state)) {
			throw APIError.invalidArgument("Missing OAuth code or state");
		}

		const result = await handleOAuthCallback(
			{
				code,
				state,
				provider, // optional, works for both cases
			},
			oauthDeps
		);

		const response = {
			provider: result.provider,
			redirectTo: result.returnTo ?? AuthConfig.postLoginRedirect,
			userId: result.localUser.id,
		};

		const parsedResponse = oauthCallbackResponseSchema.safeParse(response);

		if (!parsedResponse.success) {
			throw APIError.internal("Invalid OAuth callback response");
		}

		return parsedResponse.data;
	}
);

export const loginViaSocial = api<
	LoginViaSocialRequest,
	LoginViaSocialResponse
>(
	{
		expose: true,
		method: "GET",
		path: "/auth/login/social",
	},
	async (req): Promise<LoginViaSocialResponse> => {
		const parsedReq = loginViaSocialRequestSchema.safeParse({
			provider: req.provider ?? "google",
			returnTo: req.returnTo ?? undefined,
		});
		if (!parsedReq.success) {
			console.error(
				"loginViaSocial validation error:",
				z.treeifyError(parsedReq.error)
			);
			throw APIError.invalidArgument("Invalid request parameters");
		}

		const { provider, returnTo } = parsedReq.data;

		const safeReturnTo =
			returnTo && returnTo !== "" ? validateReturnTo(returnTo) : undefined;

		const state = createState();
		const codeVerifier = createCodeVerifier();
		const codeChallenge = await createCodeChallenge(codeVerifier);

		await oauthStates.set(
			{ state },
			{
				codeVerifier,
				provider,
				returnTo: safeReturnTo,
				createdAt: new Date().toISOString(),
			}
		);

		const authorizeUrl = new URL(
			`${AuthConfig.cognitoDomain}/oauth2/authorize`
		);

		authorizeUrl.searchParams.set(
			"identity_provider",
			mapProviderToCognito(provider)
		);
		authorizeUrl.searchParams.set("client_id", AuthConfig.clientId);
		authorizeUrl.searchParams.set("response_type", "code");
		authorizeUrl.searchParams.set("redirect_uri", AuthConfig.callbackUrl);
		authorizeUrl.searchParams.set("scope", AuthConfig.scopes.join(" "));
		authorizeUrl.searchParams.set("state", state);
		authorizeUrl.searchParams.set("code_challenge_method", "S256");
		authorizeUrl.searchParams.set("code_challenge", codeChallenge);

		const parsedResponse = loginViaSocialResponseSchema.safeParse({
			authorizeUrl: authorizeUrl.toString(),
		});
		if (!parsedResponse.success) {
			throw APIError.internal("Invalid loginViaSocial response");
		}

		return parsedResponse.data;
	}
);

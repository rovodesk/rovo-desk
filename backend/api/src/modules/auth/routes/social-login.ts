import { APIError, api } from "encore.dev/api";
import { z } from "zod";
import {
	AuthConfig,
	type TrustedSocialProvider,
} from "@/src/modules/auth/auth.config";
import { oauthStates } from "../cache";
import {
	createCodeChallenge,
	createCodeVerifier,
	createState,
	mapProviderToCognito,
	validateReturnTo,
} from "../utils";

const loginViaSocialSchema = z.object({
	provider: z.enum(["google", "github", "linear"]).default("google"),
	returnTo: z.url().optional().nullable().or(z.literal("")),
});

interface LoginViaSocialRequest {
	provider?: TrustedSocialProvider;
	returnTo?: string | null;
}

interface LoginViaSocialResponse {
	success: true;
	authorizeUrl: string;
}

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
		const parsedReq = loginViaSocialSchema.safeParse({
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

		return {
			success: true,
			authorizeUrl: authorizeUrl.toString(),
		};
	}
);

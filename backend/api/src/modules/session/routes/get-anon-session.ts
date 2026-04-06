import { APIError, api } from "encore.dev/api";
import { z } from "zod";
import { sessionService } from "../service";
import type { AnonymousSession } from "../types";

const getAnonymousSessionSchema = z.object({
	accessToken: z.uuid(),
});

export interface GetAnonymousSessionRequest {
	accessToken: string;
}

export interface GetAnonymousSessionResponse {
	session: AnonymousSession | null;
}

export const getAnonymousSession = api<
	GetAnonymousSessionRequest,
	GetAnonymousSessionResponse
>(
	{
		method: "GET",
		path: "/internal/session/anonymous/:accessToken",
		expose: false,
	},
	async (req) => {
		const parsed = getAnonymousSessionSchema.safeParse(req);
		if (!parsed.success) {
			throw APIError.invalidArgument("Invalid access token");
		}

		const anon = await sessionService.getAnonymousSession(
			parsed.data.accessToken
		);
		if (!anon) {
			return { session: null };
		}

		return {
			session: {
				accessToken: anon.accessToken,
				email: anon.email,
				cognitoSession: anon.cognitoSession,
				challengeName: anon.challengeName ?? null,
				createdAt: anon.createdAt,
			},
		};
	}
);

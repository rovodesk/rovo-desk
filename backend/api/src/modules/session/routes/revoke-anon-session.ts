import { APIError, api } from "encore.dev/api";
import { z } from "zod";
import { sessionService } from "../service";

const revokeAnonymousSessionSchema = z.object({
	accessToken: z.uuid(),
});

export interface RevokeAnonymousSessionRequest {
	accessToken: string;
}

export interface RevokeAnonymousSessionResponse {
	success: true;
}

export const revokeAnonymousSession = api<
	RevokeAnonymousSessionRequest,
	RevokeAnonymousSessionResponse
>(
	{
		method: "DELETE",
		path: "/internal/session/anonymous/:accessToken",
		expose: false,
	},
	async (req) => {
		const parsed = revokeAnonymousSessionSchema.safeParse(req);

		if (!parsed.success) {
			throw APIError.invalidArgument("Invalid access token");
		}

		await sessionService.revokeAnonymousSession(parsed.data.accessToken);

		return {
			success: true,
		};
	}
);

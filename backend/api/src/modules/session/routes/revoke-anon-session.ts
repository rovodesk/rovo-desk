import {
	type RevokeAnonymousSessionRequest,
	type RevokeAnonymousSessionResponse,
	revokeAnonymousSessionRequestSchema,
	revokeAnonymousSessionResponseSchema,
} from "@zero-heads-lab/shared/contracts";
import { APIError, api } from "encore.dev/api";
import { z } from "zod";
import { sessionService } from "../service";

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
		const parsed = revokeAnonymousSessionRequestSchema.safeParse(req);

		if (!parsed.success) {
			throw APIError.invalidArgument("Invalid access token");
		}

		await sessionService.revokeAnonymousSession(parsed.data.accessToken);

		const parsedRes = revokeAnonymousSessionResponseSchema.safeParse({
			success: true,
		});

		if (!parsedRes.success) {
			console.error(z.treeifyError(parsedRes.error).errors);
			throw APIError.internal("Failed to parse session response");
		}

		return parsedRes.data;
	}
);

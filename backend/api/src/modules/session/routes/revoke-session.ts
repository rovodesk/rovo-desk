import {
	type RevokeSessionRequest,
	type RevokeSessionResponse,
	revokeSessionRequestSchema,
	revokeSessionResponseSchema,
} from "@zero-heads-lab/shared/contracts";
import { APIError, api } from "encore.dev/api";
import { z } from "zod";
import { sessionService } from "../service";

export const revokeSession = api<RevokeSessionRequest, RevokeSessionResponse>(
	{
		method: "DELETE",
		path: "/internal/session/:sessionId",
		expose: false,
	},
	async (req) => {
		const parsed = revokeSessionRequestSchema.safeParse(req);
		if (!parsed.success) {
			throw APIError.invalidArgument("Invalid session ID");
		}

		await sessionService.revokeSession(parsed.data.sessionId);

		const parsedRes = revokeSessionResponseSchema.safeParse({
			success: true,
		});
		if (!parsedRes.success) {
			console.error(z.treeifyError(parsedRes.error).errors);
			throw APIError.internal("Failed to parse session response");
		}

		return parsedRes.data;
	}
);

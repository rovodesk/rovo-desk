import { APIError, api } from "encore.dev/api";
import { z } from "zod";
import { sessionService } from "../service";

const revokeSessionSchema = z.object({
	sessionId: z.string().uuid(),
});

export interface RevokeSessionRequest {
	sessionId: string;
}

export interface RevokeSessionResponse {
	success: true;
}

export const revokeSession = api<RevokeSessionRequest, RevokeSessionResponse>(
	{
		method: "DELETE",
		path: "/internal/session/:sessionId",
		expose: false,
	},
	async (req) => {
		const parsed = revokeSessionSchema.safeParse(req);

		if (!parsed.success) {
			throw APIError.invalidArgument("Invalid session ID");
		}

		await sessionService.revokeSession(parsed.data.sessionId);

		return {
			success: true,
		};
	}
);

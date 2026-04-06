import { APIError, api } from "encore.dev/api";
import { z } from "zod";
import { sessionService } from "../service";

const createAnonymousSessionSchema = z.object({
	accessToken: z.uuid(),
	email: z.email(),
	cognitoSession: z.string().min(1),
	challengeName: z.string().optional().nullable(),
	createdAt: z.iso.datetime(),
});

export interface CreateAnonymousSessionRequest {
	accessToken: string;
	email: string;
	cognitoSession: string;
	challengeName?: string | null;
	createdAt: string;
}

export interface CreateAnonymousSessionResponse {
	success: true;
}

export const createAnonymousSession = api<
	CreateAnonymousSessionRequest,
	CreateAnonymousSessionResponse
>(
	{
		method: "POST",
		path: "/internal/session/anonymous",
		expose: false,
	},
	async (req) => {
		const parsed = createAnonymousSessionSchema.safeParse(req);
		if (!parsed.success) {
			console.error(z.treeifyError(parsed.error).errors);
			throw APIError.invalidArgument("Invalid session payload");
		}

		await sessionService.createAnonymousSession(parsed.data);

		return {
			success: true,
		};
	}
);

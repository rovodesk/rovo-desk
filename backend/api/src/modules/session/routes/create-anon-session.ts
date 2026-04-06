import {
	type CreateAnonymousSessionRequest,
	type CreateAnonymousSessionResponse,
	createAnonymousSessionRequestSchema,
	createAnonymousSessionResponseSchema,
} from "@zero-heads-lab/shared/contracts";
import { APIError, api } from "encore.dev/api";
import { z } from "zod";
import { sessionService } from "../service";

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
		const parsed = createAnonymousSessionRequestSchema.safeParse(req);
		if (!parsed.success) {
			console.error(z.treeifyError(parsed.error).errors);
			throw APIError.invalidArgument("Invalid session payload");
		}

		await sessionService.createAnonymousSession(parsed.data);

		const parsedRes = createAnonymousSessionResponseSchema.safeParse({
			accessToken: parsed.data.accessToken,
		});

		if (!parsedRes.success) {
			console.error(z.treeifyError(parsedRes.error).errors);
			throw APIError.internal("Failed to create anonymous session");
		}

		return parsedRes.data;
	}
);

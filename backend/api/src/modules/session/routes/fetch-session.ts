import {
	type GetSessionRequest,
	type GetSessionResponse,
	getSessionRequestSchema,
	getSessionResponseSchema,
} from "@zero-heads-lab/shared/contracts";
import { APIError, api } from "encore.dev/api";
import { z } from "zod";
import { sessionService } from "../service";

export const getSession = api<GetSessionRequest, GetSessionResponse>(
	{
		method: "POST",
		path: "/session/get-session",
		expose: true,
	},
	async (req) => {
		const parsed = getSessionRequestSchema.safeParse(req);
		if (!parsed.success) {
			console.error(z.treeifyError(parsed.error).errors);
			throw APIError.invalidArgument("Invalid session payload");
		}

		const sessionId = parsed.data.sessionId?.trim();

		if (!sessionId) {
			return {
				authenticated: false,
				user: null,
				session: null,
			};
		}

		const currentSession = await sessionService.getSession(sessionId);

		if (!currentSession) {
			return {
				authenticated: false,
				user: null,
				session: null,
			};
		}

		await sessionService.ensureSessionExists(sessionId);

		const res: GetSessionResponse = {
			authenticated: true,
			user: {
				id: currentSession.userId,
				email: currentSession.email ?? null,
				name: currentSession.name ?? null,
				provider: currentSession.provider ?? null,
			},
			session: {
				sessionId: currentSession.sessionId,
				createdAt: currentSession.createdAt,
				lastSeenAt: new Date().toISOString(),
				mfaVerified: currentSession.mfaVerified,
			},
		};

		const parsedRes = getSessionResponseSchema.safeParse(res);
		if (!parsedRes.success) {
			console.error(z.treeifyError(parsedRes.error).errors);
			throw APIError.internal("Failed to parse session response");
		}

		return parsedRes.data;
	}
);

import { api } from "encore.dev/api";
import { sessionService } from "../service";

interface GetSessionRequest {
	sessionId: string;
}

interface GetSessionResponse {
	authenticated: boolean;
	user: {
		id: string;
		email: string | null;
		name: string | null;
		provider: string | null;
	} | null;
	session: {
		sessionId: string;
		createdAt: string;
		lastSeenAt: string;
		mfaVerified: boolean;
	} | null;
}

export const getSession = api<GetSessionRequest, GetSessionResponse>(
	{
		method: "POST",
		path: "/session/get-session",
		expose: true,
	},
	async (req) => {
		const sessionId = req.sessionId?.trim();

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

		return {
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
	}
);

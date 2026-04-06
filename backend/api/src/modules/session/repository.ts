import { SQLDatabase } from "encore.dev/storage/sqldb";
import type { AuthenticatedSession } from "./types";

export interface ISessionRepository {
	insertSession(session: AuthenticatedSession): Promise<void>;
	findSessionById(sessionId: string): Promise<AuthenticatedSession | null>;
	listActiveSessionsByUserId(userId: string): Promise<AuthenticatedSession[]>;
	updateLastSeenAt(sessionId: string, lastSeenAt: string): Promise<void>;
	revokeSession(sessionId: string, revokedAt: string): Promise<void>;
	revokeAllSessions(userId: string, revokedAt: string): Promise<void>;
	deleteExpiredSessions(): Promise<void>;
}

const db = SQLDatabase.named("shared-db");

function mapRow(row: any): AuthenticatedSession {
	return {
		sessionId: row.session_id,
		userId: row.user_id,
		email: row.email,
		name: row.name,
		provider: row.provider,
		mfaVerified: row.mfa_verified,
		createdAt: row.created_at.toISOString(),
		lastSeenAt: row.last_seen_at.toISOString(),
		expiresAt: row.expires_at.toISOString(),
		revokedAt: row.revoked_at?.toISOString() ?? null,
		ipAddress: row.ip_address,
		userAgent: row.user_agent,
		deviceName: row.device_name,
	};
}

export class SessionRepository implements ISessionRepository {
	async insertSession(session: AuthenticatedSession): Promise<void> {
		await db.exec`
      INSERT INTO auth_sessions (
        session_id, user_id, email, name, provider, mfa_verified,
        created_at, last_seen_at, expires_at, revoked_at,
        ip_address, user_agent, device_name
      )
      VALUES (
        ${session.sessionId},
        ${session.userId},
        ${session.email ?? null},
        ${session.name ?? null},
        ${session.provider ?? null},
        ${session.mfaVerified},
        ${session.createdAt},
        ${session.lastSeenAt},
        ${session.expiresAt},
        ${session.revokedAt ?? null},
        ${session.ipAddress ?? null},
        ${session.userAgent ?? null},
        ${session.deviceName ?? null}
      )
    `;
	}

	async findSessionById(
		sessionId: string
	): Promise<AuthenticatedSession | null> {
		const row = await db.queryRow`
      SELECT *
      FROM auth_sessions
      WHERE session_id = ${sessionId}
      LIMIT 1
    `;

		if (!row) return null;
		return mapRow(row);
	}

	async listActiveSessionsByUserId(
		userId: string
	): Promise<AuthenticatedSession[]> {
		const rows = await db.queryAll`
      SELECT *
      FROM auth_sessions
      WHERE user_id = ${userId}
        AND revoked_at IS NULL
        AND expires_at > NOW()
      ORDER BY created_at ASC
    `;

		return rows.map(mapRow);
	}

	async updateLastSeenAt(sessionId: string, lastSeenAt: string): Promise<void> {
		await db.exec`
      UPDATE auth_sessions
      SET last_seen_at = ${lastSeenAt}
      WHERE session_id = ${sessionId}
        AND revoked_at IS NULL
    `;
	}

	async revokeSession(sessionId: string, revokedAt: string): Promise<void> {
		await db.exec`
      UPDATE auth_sessions
      SET revoked_at = ${revokedAt}
      WHERE session_id = ${sessionId}
        AND revoked_at IS NULL
    `;
	}

	async revokeAllSessions(userId: string, revokedAt: string): Promise<void> {
		await db.exec`
      UPDATE auth_sessions
      SET revoked_at = ${revokedAt}
      WHERE user_id = ${userId}
        AND revoked_at IS NULL
    `;
	}

	async deleteExpiredSessions(): Promise<void> {
		await db.exec`
      DELETE FROM auth_sessions
      WHERE expires_at <= NOW()
         OR revoked_at IS NOT NULL
    `;
	}
}

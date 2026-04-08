import type { Session } from "@/domain/value-objects/session.vo";
import type { UserId } from "@/domain/value-objects/user-id.vo";

export abstract class ISessionRepository {
	abstract findById(sessionId: string): Promise<Session | null>;

	abstract findByUserId(userId: UserId): Promise<Session[]>;

	abstract findActiveByUserId(userId: UserId): Promise<Session[]>;

	abstract save(userId: UserId, session: Session): Promise<void>;

	abstract revoke(sessionId: string): Promise<void>;

	abstract revokeAllByUserId(userId: UserId): Promise<void>;

	abstract deleteExpired(now?: Date): Promise<number>;
}

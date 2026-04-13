import {
	ExpiredSessionTouchError,
	InvalidSessionIdError,
	RevokedSessionTouchError,
	SessionExpiryError,
} from "../errors/user.errors";
import { Status } from "./session-status.vo";

export class Session {
	constructor(
		readonly id: string,
		readonly status: Status,
		readonly createdAt: Date,
		readonly lastSeenAt: Date,
		readonly expiresAt: Date,
		readonly revokedAt: Date | null
	) {
		if (!id.trim()) throw new InvalidSessionIdError(id);

		if (expiresAt.getTime() < createdAt.getTime()) {
			throw new SessionExpiryError();
		}
	}

	get isActive(): boolean {
		return this.status.isActive() && !this.isExpired && !this.isRevoked;
	}

	get isRevoked(): boolean {
		return this.revokedAt !== null || this.status.isRevoked();
	}

	get isExpired(): boolean {
		return this.expiresAt.getTime() <= Date.now() || this.status.isExpired();
	}

	touch(now = new Date()): Session {
		if (this.isRevoked) throw new RevokedSessionTouchError();
		if (this.isExpired) throw new ExpiredSessionTouchError();

		return new Session(
			this.id,
			this.status,
			this.createdAt,
			now,
			this.expiresAt,
			this.revokedAt
		);
	}

	revoke(now = new Date()): Session {
		if (this.isRevoked) return this;

		return new Session(
			this.id,
			Status.revoked(),
			this.createdAt,
			this.lastSeenAt,
			this.expiresAt,
			now
		);
	}

	expire(now = new Date()): Session {
		if (this.isExpired) return this;

		return new Session(
			this.id,
			Status.expired(),
			this.createdAt,
			this.lastSeenAt,
			now,
			this.revokedAt
		);
	}

	end(): Session {
		return new Session(
			this.id,
			Status.ended(),
			this.createdAt,
			this.lastSeenAt,
			this.expiresAt,
			this.revokedAt
		);
	}

	suspend(): Session {
		return new Session(
			this.id,
			Status.suspended(),
			this.createdAt,
			this.lastSeenAt,
			this.expiresAt,
			this.revokedAt
		);
	}
}

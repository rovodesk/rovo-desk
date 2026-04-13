import { User } from "../entities/user.entity";
import {
	InvalidUserStateError,
	PrimaryIdentityError,
} from "../errors/user.errors";
import { UserEmail } from "../value-objects/email.vo";
import type { Identity } from "../value-objects/identity.vo";
import type { Session } from "../value-objects/session.vo";
import { UserId } from "../value-objects/user-id.vo";
import { UserStatus } from "../value-objects/user-status.vo";

export class UserService {
	createUser(params: {
		id: string;
		email: string;
		identity: Identity;
		createdAt?: Date;
	}): User {
		const now = params.createdAt ?? new Date();

		const primaryIdentity = params.identity.isPrimaryIdentity
			? params.identity
			: params.identity.markPrimary();

		return new User(
			UserId.create(params.id),
			UserEmail.create(params.email),
			UserStatus.active(),
			[primaryIdentity],
			[],
			now,
			now
		);
	}

	resolveCanonicalEmail(user: User): UserEmail {
		const primaryIdentity = user.PrimaryIdentity;

		if (!primaryIdentity) {
			throw new PrimaryIdentityError();
		}

		if (!primaryIdentity.email) {
			return user.Email;
		}

		return UserEmail.create(primaryIdentity.email);
	}

	ensureUserCanAuthenticate(user: User): void {
		if (user.Status.isDeleted()) {
			throw new InvalidUserStateError();
		}

		if (user.Status.isBanned()) {
			throw new InvalidUserStateError();
		}

		if (user.Status.isSuspended()) {
			throw new InvalidUserStateError();
		}

		if (user.Identities.length === 0) {
			throw new InvalidUserStateError();
		}
	}

	getActiveSessions(user: User): Session[] {
		return user.Sessions.filter((session) => session.isActive);
	}

	hasActiveSession(user: User): boolean {
		return this.getActiveSessions(user).length > 0;
	}

	pruneInactiveSessions(user: User, now = new Date()): Session[] {
		return user.Sessions.filter(
			(session) =>
				!session.isRevoked && session.expiresAt.getTime() > now.getTime()
		);
	}
}

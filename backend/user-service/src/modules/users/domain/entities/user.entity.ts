import {
	DeletedUserCannotBeModifiedError,
	DeletedUserCannotBeReactivatedError,
	DeletedUserSuspendedError,
	DuplicateIdentityError,
	DuplicatePrimaryIdentityError,
	IdentityNotFoundError,
	InvalidCreatedAtError,
	InvalidUpdatedAtError,
	PrimaryIdentityError,
	SessionExistsError,
	SessionNotFoundError,
} from "../errors/user.errors";
import type { UserEmail } from "../value-objects/email.vo";
import type { Identity } from "../value-objects/identity.vo";
import { IdentityProvider } from "../value-objects/provider.vo";
import type { Session } from "../value-objects/session.vo";
import type { UserId } from "../value-objects/user-id.vo";
import { UserStatus } from "../value-objects/user-status.vo";

export class User {
	constructor(
		private readonly id: UserId,
		private email: UserEmail,
		private status: UserStatus,
		private identities: Identity[],
		private sessions: Session[],
		private readonly createdAt: Date,
		private updatedAt: Date
	) {
		if (!createdAt) throw new InvalidCreatedAtError();
		if (!updatedAt) throw new InvalidUpdatedAtError();

		this.ensureSinglePrimaryIdentity();
		this.ensureAtLeastOneIdentity();
	}

	// ---------------- getters ----------------

	get Id(): UserId {
		return this.id;
	}

	get Email(): UserEmail {
		return this.email;
	}

	get Status(): UserStatus {
		return this.status;
	}

	get Identities(): Identity[] {
		return [...this.identities];
	}

	get Sessions(): Session[] {
		return [...this.sessions];
	}

	get CreatedAt(): Date {
		return this.createdAt;
	}

	get UpdatedAt(): Date {
		return this.updatedAt;
	}

	get PrimaryIdentity(): Identity | null {
		return this.identities.find((i) => i.isPrimaryIdentity) ?? null;
	}

	get ActiveSessions(): Session[] {
		return this.sessions.filter((s) => s.isActive);
	}

	// ---------------- identity ----------------

	linkIdentity(identity: Identity): void {
		this.ensureUserIsMutable();

		if (this.identities.some((i) => i.equals(identity))) {
			throw new DuplicateIdentityError(
				identity.provider.Value,
				identity.providerUserId
			);
		}

		let nextIdentity = identity;

		// first identity should always become primary
		if (this.identities.length === 0) {
			nextIdentity = identity.markPrimary();
		}

		if (nextIdentity.isPrimaryIdentity) {
			this.identities = this.identities.map((i) => i.unmarkPrimary());
		}

		this.identities.push(nextIdentity);

		this.ensureSinglePrimaryIdentity();
		this.touch();
	}

	unlinkIdentity(provider: string, providerUserId: string): void {
		this.ensureUserIsMutable();

		if (this.identities.length === 1) {
			throw new Error("Cannot remove last identity");
		}

		const targetProvider = IdentityProvider.create(provider);

		const identity = this.identities.find(
			(i) =>
				i.provider.equals(targetProvider) && i.providerUserId === providerUserId
		);

		if (!identity) {
			throw new IdentityNotFoundError(provider, providerUserId);
		}

		if (identity.isPrimaryIdentity) {
			throw new PrimaryIdentityError();
		}

		this.identities = this.identities.filter((i) => !i.equals(identity));
		this.touch();
	}

	setPrimaryIdentity(provider: string, providerUserId: string): void {
		this.ensureUserIsMutable();

		const targetProvider = IdentityProvider.create(provider);
		let found = false;

		this.identities = this.identities.map((i) => {
			if (
				i.provider.equals(targetProvider) &&
				i.providerUserId === providerUserId
			) {
				found = true;
				return i.markPrimary();
			}

			return i.unmarkPrimary();
		});

		if (!found) {
			throw new IdentityNotFoundError(provider, providerUserId);
		}

		this.ensureSinglePrimaryIdentity();
		this.touch();
	}

	hasIdentity(provider: string, providerUserId: string): boolean {
		const targetProvider = IdentityProvider.create(provider);

		return this.identities.some(
			(i) =>
				i.provider.equals(targetProvider) && i.providerUserId === providerUserId
		);
	}

	// ---------------- session ----------------

	addSession(session: Session): void {
		this.ensureUserIsMutable();

		if (this.sessions.some((s) => s.id === session.id)) {
			throw new SessionExistsError(session.id);
		}

		this.sessions.push(session);
		this.touch();
	}

	revokeSession(sessionId: string): void {
		this.ensureUserIsMutable();

		let found = false;

		this.sessions = this.sessions.map((s) => {
			if (s.id === sessionId) {
				found = true;
				return s.revoke();
			}
			return s;
		});

		if (!found) {
			throw new SessionNotFoundError(sessionId);
		}

		this.touch();
	}

	touchSession(sessionId: string): void {
		this.ensureUserIsMutable();

		let found = false;

		this.sessions = this.sessions.map((s) => {
			if (s.id === sessionId) {
				found = true;
				return s.touch();
			}
			return s;
		});

		if (!found) {
			throw new SessionNotFoundError(sessionId);
		}

		this.touch();
	}

	revokeAllSessions(): void {
		this.sessions = this.sessions.map((s) => s.revoke());
		this.touch();
	}

	removeExpiredSessions(now = new Date()): void {
		this.sessions = this.sessions.filter(
			(s) => s.expiresAt.getTime() > now.getTime() && !s.isRevoked
		);
		this.touch();
	}

	// ---------------- email ----------------

	updateEmail(email: UserEmail): void {
		this.ensureUserIsMutable();

		if (this.email.equals(email)) return;

		this.email = email;
		this.touch();
	}

	verifyEmail(): void {
		this.ensureUserIsMutable();

		if (this.email.isVerified) return;

		this.email = this.email.verify();
		this.touch();
	}

	// ---------------- status ----------------

	activate(): void {
		if (this.status.isDeleted()) {
			throw new DeletedUserCannotBeReactivatedError();
		}

		this.status = UserStatus.active();
		this.touch();
	}

	suspend(): void {
		if (this.status.isDeleted()) {
			throw new DeletedUserSuspendedError();
		}

		this.status = UserStatus.suspended();
		this.revokeAllSessions();
		this.touch();
	}

	ban(): void {
		if (this.status.isDeleted()) {
			throw new Error("Deleted user cannot be banned");
		}

		this.status = UserStatus.banned();
		this.revokeAllSessions();
		this.touch();
	}

	markDeleted(): void {
		this.status = UserStatus.deleted();
		this.revokeAllSessions();
		this.touch();
	}

	// ---------------- guards ----------------

	private ensureUserIsMutable(): void {
		if (this.status.isDeleted()) {
			throw new DeletedUserCannotBeModifiedError();
		}
	}

	private ensureSinglePrimaryIdentity(): void {
		const primaryCount = this.identities.filter(
			(i) => i.isPrimaryIdentity
		).length;

		if (primaryCount > 1) {
			throw new DuplicatePrimaryIdentityError();
		}
	}

	private ensureAtLeastOneIdentity(): void {
		if (this.identities.length === 0) {
			throw new PrimaryIdentityError();
		}
	}

	// ---------------- utils ----------------

	private touch(): void {
		this.updatedAt = new Date();
	}
}

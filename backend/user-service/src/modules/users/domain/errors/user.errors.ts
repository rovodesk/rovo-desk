export abstract class AuthDomainError extends Error {
	constructor(message: string) {
		super(message);
		this.name = new.target.name;
	}
}

export class DuplicateIdentityError extends AuthDomainError {
	constructor(provider: string, providerUserId: string) {
		super(`Identity already linked: ${provider}:${providerUserId}`);
	}
}

export class IdentityNotFoundError extends AuthDomainError {
	constructor(provider: string, providerUserId: string) {
		super(`Identity not found: ${provider}:${providerUserId}`);
	}
}

export class PrimaryIdentityError extends AuthDomainError {
	constructor() {
		super("User must have at least one primary identity");
	}
}

export class DuplicatePrimaryIdentityError extends AuthDomainError {
	constructor() {
		super("User already has a primary identity");
	}
}

export class SessionNotFoundError extends AuthDomainError {
	constructor(sessionId: string) {
		super(`Session not found: ${sessionId}`);
	}
}

export class UserNotFoundError extends AuthDomainError {
	constructor(userId: string) {
		super(`User not found: ${userId}`);
	}
}

export class SessionStateError extends AuthDomainError {
	constructor() {
		super("Session is not in active state");
	}
}

export class InvalidUserStateError extends AuthDomainError {
	constructor() {
		super("User is not in active state");
	}
}

export class InvalidEmailError extends AuthDomainError {
	constructor(value: string) {
		super(`Invalid email: ${value}`);
	}
}

export class InvalidProviderUserIdError extends AuthDomainError {
	constructor() {
		super("Invalid provider user id");
	}
}

export class InvalidProviderError extends AuthDomainError {
	constructor(value: string) {
		super(`Invalid identity provider: ${value}`);
	}
}

export class InvalidSessionIdError extends AuthDomainError {
	constructor(value: string) {
		super(`Invalid session id: ${value}`);
	}
}

export class InvalidUserStatusError extends AuthDomainError {
	constructor(value: string) {
		super(`Invalid user status: ${value}`);
	}
}

export class InvalidSessionStatusError extends AuthDomainError {
	constructor(value: string) {
		super(`Invalid session status: ${value}`);
	}
}

export class SessionExpiryError extends AuthDomainError {
	constructor() {
		super("Session expiry cannot be before creation");
	}
}

export class RevokedSessionTouchError extends AuthDomainError {
	constructor() {
		super("Cannot touch a revoked session");
	}
}

export class ExpiredSessionTouchError extends AuthDomainError {
	constructor() {
		super("Cannot touch an expired session");
	}
}

export class InvalidUserIdError extends AuthDomainError {
	constructor(value: string) {
		super(`Invalid user id: ${value}`);
	}
}

export class InvalidCreatedAtError extends AuthDomainError {
	constructor() {
		super("User createdAt is required");
	}
}

export class InvalidUpdatedAtError extends AuthDomainError {
	constructor() {
		super("User updatedAt is required");
	}
}

export class SessionExistsError extends AuthDomainError {
	constructor(sessionId: string) {
		super(`Session already exists: ${sessionId}`);
	}
}

export class DeletedUserSuspendedError extends AuthDomainError {
	constructor() {
		super("Deleted user cannot be suspended");
	}
}

export class DeletedUserCannotBeReactivatedError extends AuthDomainError {
	constructor() {
		super("Deleted user cannot be reactivated");
	}
}

export class DeletedUserCannotBeModifiedError extends AuthDomainError {
	constructor() {
		super("Deleted user cannot be deactivated");
	}
}

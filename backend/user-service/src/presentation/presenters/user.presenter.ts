import type { User } from "@/domain/user";
import type { Identity } from "@/domain/value-objects/identity.vo";
import type { Session } from "@/domain/value-objects/session.vo";

/**
 * UserPresenter
 *
 * Converts domain User and related value objects to API response DTOs.
 * Separates presentation concerns from domain model.
 *
 * Responsibilities:
 * - Transform User aggregate to user response DTO
 * - Transform Sessions to session response DTOs
 * - Transform Identities to identity response DTOs
 * - Hide sensitive data
 * - Format data for API consumers
 */
export class UserPresenter {
	/**
	 * Convert domain User to API response DTO
	 */
	static toUserResponse(user: User) {
		return {
			id: user.Id.Value,
			email: user.Email.Value,
			emailVerified: user.Email.isVerified,
			status: user.Status.value,
			identities: user.Identities.map((id) =>
				UserPresenter.toIdentityResponse(id)
			),
			sessions: user.Sessions.map((s) => UserPresenter.toSessionResponse(s)),
			createdAt: user.CreatedAt.toISOString(),
			updatedAt: user.UpdatedAt.toISOString(),
		};
	}

	/**
	 * Convert domain Identity VO to API response DTO
	 */
	static toIdentityResponse(identity: Identity) {
		return {
			provider: identity.provider.Value,
			providerUserId: identity.providerUserId,
			email: identity.email,
			isPrimary: identity.isPrimaryIdentity,
			linkedAt: identity.linkedAtIdentity.toISOString(),
		};
	}

	/**
	 * Convert domain Session VO to API response DTO
	 */
	static toSessionResponse(session: Session) {
		return {
			id: session.id,
			status: session.status.value,
			isActive: session.isActive,
			isRevoked: session.isRevoked,
			isExpired: session.isExpired,
			createdAt: session.createdAt.toISOString(),
			lastSeenAt: session.lastSeenAt.toISOString(),
			expiresAt: session.expiresAt.toISOString(),
			revokedAt: session.revokedAt?.toISOString() || null,
		};
	}

	/**
	 * Convert User to minimal profile response
	 * Used for embeded user info in other resources
	 */
	static toMinimalUserResponse(user: User) {
		return {
			id: user.Id.Value,
			email: user.Email.Value,
			status: user.Status.value,
		};
	}
}

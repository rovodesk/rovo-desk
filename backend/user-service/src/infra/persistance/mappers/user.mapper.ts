import { User } from "@/domain/user";
import { UserEmail } from "@/domain/value-objects/email.vo";
import { Identity } from "@/domain/value-objects/identity.vo";
import { IdentityProvider } from "@/domain/value-objects/provider.vo";
import { Session } from "@/domain/value-objects/session.vo";
import { Status } from "@/domain/value-objects/session-status.vo";
import { UserId } from "@/domain/value-objects/user-id.vo";
import { UserStatus } from "@/domain/value-objects/user-status.vo";
import { UserIdentitySchema } from "../schemas/identity.schema";
import { UserSessionSchema } from "../schemas/session.schema";
import { UserSchema } from "../schemas/user.schema";

/**
 * UserMapper
 *
 * Responsible for mapping between persistence layer and domain layer.
 *
 * Handles:
 * - UserSchema + UserIdentitySchema[] + UserSessionSchema[] → User (domain)
 * - User (domain) → UserSchema + related schemas (for persistence)
 *
 * CRITICAL: This mapper bridges the multi-table persistence model with the
 * aggregate root domain model. All domain invariants are applied here.
 */
export class UserMapper {
	/**
	 * Hydrate domain User from persistence.
	 *
	 * Called when loading a user from the database.
	 * Assumes all related entities (identities, sessions) are loaded.
	 */
	static toDomain(
		userSchema: UserSchema,
		identities: UserIdentitySchema[],
		sessions: UserSessionSchema[]
	): User {
		// 1. Reconstruct value objects from schema
		const userId = UserId.fromPersistence(userSchema.id);
		const userEmail = UserMapper.reconstructUserEmail(userSchema);
		const userStatus = UserMapper.reconstructUserStatus(userSchema);

		// 2. Reconstruct identities (from separate table)
		const domainIdentities = identities.map((schema) =>
			UserMapper.identitySchemaToVO(schema)
		);

		// 3. Reconstruct sessions (from separate table)
		const domainSessions = sessions.map((schema) =>
			UserMapper.sessionSchemaToVO(schema)
		);

		// 4. Create User aggregate (this enforces all domain invariants)
		const user = new User(
			userId,
			userEmail,
			userStatus,
			domainIdentities,
			domainSessions,
			userSchema.createdAt,
			userSchema.updatedAt
		);

		return user;
	}

	/**
	 * Persist domain User back to schemas.
	 *
	 * Returns the updated UserSchema for persistence.
	 * Related identities and sessions are handled separately via repositories.
	 */
	static toPersistence(user: User): UserSchema {
		const schema = new UserSchema();

		// Basic fields
		schema.id = user.Id.Value;
		schema.createdAt = user.CreatedAt;
		schema.updatedAt = user.UpdatedAt;

		// Email is stored in the User table (denormalized for fast lookup)
		// The canonical email is derived from the primary identity in the identity table
		schema.metadata = schema.metadata ?? {};

		// Status is persisted via flags (not a dedicated status column)
		if (user.Status.isBanned()) {
			schema.banned = true;
		} else if (user.Status.isDeleted()) {
			schema.deletedAt = new Date();
		}

		// Note: identities and sessions are handled separately and not persisted here.
		// This method only updates the user record itself.

		return schema;
	}

	/**
	 * Convert UserIdentitySchema to Identity value object.
	 */
	static identitySchemaToVO(schema: UserIdentitySchema): Identity {
		return Identity.create({
			provider: IdentityProvider.create(schema.provider),
			providerUserId: schema.providerUserId,
			email: schema.email ?? null,
			isPrimary: schema.isPrimary,
			linkedAt: schema.linkedAt,
		});
	}

	/**
	 * Convert UserSessionSchema to Session value object.
	 */
	private static sessionSchemaToVO(schema: UserSessionSchema): Session {
		return new Session(
			schema.id,
			Status.create(schema.status),
			schema.issuedAt,
			schema.lastSeenAt,
			schema.expiresAt,
			schema.revokedAt ?? null
		);
	}

	/**
	 * Reconstruct UserEmail from UserSchema.
	 *
	 * Email verification state is stored in the primary identity,
	 * but we also maintain a user-level email field for fast queries.
	 */
	private static reconstructUserEmail(userSchema: UserSchema): UserEmail {
		// Get primary identity email if available
		const primaryIdentity = userSchema.identities?.find((i) => i.isPrimary);

		if (primaryIdentity?.email) {
			return UserEmail.fromPersistence(
				primaryIdentity.email,
				primaryIdentity.emailVerified,
				null, // verifiedAt is not tracked separately in schema
				primaryIdentity.linkedAt
			);
		}

		// Fallback: use a placeholder if no primary identity (shouldn't happen in practice)
		return UserEmail.create("unknown@example.com");
	}

	/**
	 * Reconstruct UserStatus from UserSchema.
	 *
	 * Status is derived from flags:
	 * - deleted: if deletedAt is set
	 * - banned: if banned flag is true
	 * - suspended: if a suspension flag is added later
	 * - active: default
	 */
	private static reconstructUserStatus(userSchema: UserSchema): UserStatus {
		if (userSchema.deletedAt) {
			return UserStatus.deleted();
		}

		if (userSchema.banned) {
			return UserStatus.banned();
		}

		// Future: add suspended flag if needed
		// if (userSchema.suspended) {
		//   return UserStatus.suspended();
		// }

		return UserStatus.active();
	}

	/**
	 * Convert Identity value object to UserIdentitySchema for persistence.
	 */
	static identityVOToSchema(
		identity: Identity,
		userId: string
	): UserIdentitySchema {
		const schema = new UserIdentitySchema();

		schema.userId = userId;
		schema.provider = identity.provider.Value;
		schema.providerUserId = identity.providerUserId;
		schema.email = identity.email ?? "";
		schema.emailVerified = false; // Default; should be set by provider
		schema.isPrimary = identity.isPrimaryIdentity;
		schema.linkedAt = identity.linkedAtIdentity;
		schema.metadata = {};

		return schema;
	}

	/**
	 * Convert Session value object to UserSessionSchema for persistence.
	 */
	static sessionVOToSchema(
		session: Session,
		userId: string
	): UserSessionSchema {
		const schema = new UserSessionSchema();

		schema.id = session.id;
		schema.userId = userId;
		schema.status = session.status.value;
		schema.issuedAt = session.createdAt;
		schema.lastSeenAt = session.lastSeenAt;
		schema.expiresAt = session.expiresAt;
		schema.revokedAt = session.revokedAt;
		schema.metadata = {};
		schema.mfaVerified = false;
		schema.sessionVersion = 1;

		return schema;
	}
}

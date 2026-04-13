import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { TypeOrmRepository } from "@zero-heads-lab/database";
import { Repository } from "@zero-heads-lab/database/repository";
import { ConnectionName } from "@zero-heads-lab/database/types";
import type { User } from "../../../domain/entities/user.entity";
import type { IUserRepository } from "../../../domain/repositories/user.repository.port";
import { UserMapper } from "../mappers/user.mapper";
import { UserIdentitySchema } from "../schemas/identity.schema";
import { UserSessionSchema } from "../schemas/session.schema";
import { UserSchema } from "../schemas/user.schema";

/**
 * UserRepository
 *
 * Implements the IUserRepository port.
 * Handles all persistence operations for the User aggregate.
 *
 * IMPORTANT ARCHITECTURAL NOTES:
 * - User is the aggregate root in the domain
 * - Identities and Sessions are owned by User and live in separate tables
 * - This repository loads related entities and uses the mapper to reconstruct the aggregate
 * - All changes to User are persisted back via the repositories for their respective entities
 */
@Injectable()
export class UserRepository
	extends Repository<UserSchema>
	implements IUserRepository
{
	constructor(
		@InjectRepository(UserSchema, ConnectionName.AUTH)
		private readonly entity: TypeOrmRepository<UserSchema>
	) {
		super(entity);
	}

	/**
	 * Find a user by ID, including all related identities and sessions.
	 */
	async findById(userId: string): Promise<User | null> {
		const userSchema = await this.entity.findOne({
			where: { id: userId },
			relations: ["identities"],
		});

		if (!userSchema) {
			return null;
		}

		// Load sessions separately (they're not a direct relation on User)
		const sessions = await this.entity.manager.find(UserSessionSchema, {
			where: { userId },
		});

		return UserMapper.toDomain(
			userSchema,
			userSchema.identities ?? [],
			sessions
		);
	}

	/**
	 * Find a user by email.
	 * Searches in the user table and returns the aggregate.
	 */
	async findByEmail(email: string): Promise<User | null> {
		const normalized = email.trim().toLowerCase();

		// Search for identity with this email (email is canonical)
		const identity = await this.entity.manager.findOne(UserIdentitySchema, {
			where: { email: normalized },
			relations: ["user"],
		});

		if (!identity?.user) {
			return null;
		}

		return this.findById(identity.user.id);
	}

	/**
	 * Find a user by identity (provider + providerUserId).
	 * This is used for OAuth/external provider lookups.
	 */
	async findByIdentity(
		provider: string,
		providerUserId: string
	): Promise<User | null> {
		const identity = await this.entity.manager.findOne(UserIdentitySchema, {
			where: {
				provider,
				providerUserId,
			},
			relations: ["user"],
		});

		if (!identity?.user) {
			return null;
		}

		return this.findById(identity.user.id);
	}

	/**
	 * Check if a user exists by ID.
	 * Lightweight operation for existence checks.
	 */
	async existsById(userId: string): Promise<boolean> {
		const result = await this.entity.findOne({
			where: { id: userId },
			select: ["id"],
		});

		return result !== null;
	}

	/**
	 * Save a user aggregate.
	 *
	 * IMPORTANT: This is a simplified implementation.
	 * In production, you should:
	 * - Use a transaction to update User + related Identities + Sessions atomically
	 * - Only update changed identities/sessions
	 * - Properly handle cascade deletes for removed entities
	 *
	 * For now, we assume the caller manages identity/session updates via
	 * separate repositories (ISessionRepository, etc.).
	 */
	async save(user: User): Promise<User> {
		const userSchema = UserMapper.toPersistence(user);

		// Update the user record itself
		const saved = await this.entity.save(userSchema);

		// Re-load to ensure consistency
		return this.findById(saved.id) as Promise<User>;
	}

	/**
	 * Delete a user (soft delete via deletedAt).
	 * In the domain, this calls user.markDeleted(), which sets status to deleted.
	 * The repository just persists it.
	 */
	async delete(userId: string): Promise<void> {
		await this.entity.update(userId, {
			deletedAt: new Date(),
		});
	}

	/**
	 * Update user profile fields (non-domain methods).
	 * Used for things like firstName, lastName, avatarUrl, etc.
	 */
	async updateProfile(
		userId: string,
		updates: {
			firstName?: string | null;
			lastName?: string | null;
			avatarUrl?: string | null;
			online?: boolean;
			lastSeenAt?: Date | null;
		}
	): Promise<void> {
		await this.entity.update(userId, updates);
	}

	/**
	 * Mark a user as banned.
	 * Note: The domain model should handle this via user.ban(), but
	 * this is a convenience method for direct persistence operations.
	 */
	async ban(userId: string, reason?: string, expiresAt?: Date): Promise<void> {
		await this.entity.update(userId, {
			banned: true,
			bannedReason: reason ?? null,
			bannedAt: new Date(),
			bannedExpiresAt: expiresAt ?? null,
		});
	}

	/**
	 * Unban a user.
	 */
	async unban(userId: string): Promise<void> {
		await this.entity.update(userId, {
			banned: false,
			bannedReason: null,
			bannedAt: null,
			bannedExpiresAt: null,
		});
	}

	/**
	 * Update last seen time for a user.
	 */
	async updateLastSeen(userId: string, now = new Date()): Promise<void> {
		await this.entity.update(userId, {
			lastSeenAt: now,
			online: true,
		});
	}

	/**
	 * Mark user as offline.
	 */
	async markOffline(userId: string): Promise<void> {
		await this.entity.update(userId, {
			online: false,
		});
	}
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { TypeOrmRepository } from "@zero-heads-lab/database";
import { Repository } from "@zero-heads-lab/database/repository";
import { ConnectionName } from "@zero-heads-lab/database/types";
import type { ISessionRepository } from "@/app/ports/session.repository.port";
import type { Session } from "@/domain/value-objects/session.vo";
import type { UserId } from "@/domain/value-objects/user-id.vo";
import { UserMapper } from "../mappers/user.mapper";
import { UserSessionSchema } from "../schemas/session.schema";

/**
 * SessionRepository
 *
 * Implements the ISessionRepository port.
 * Handles all persistence operations for Session value objects.
 *
 * IMPORTANT ARCHITECTURAL NOTES:
 * - Session is a Value Object owned by User
 * - Sessions are stored in a separate table (auth.session)
 * - This repository maps between UserSessionSchema and Session VO
 * - Queries are userId-scoped for security
 */
@Injectable()
export class SessionRepository
	extends Repository<UserSessionSchema>
	implements ISessionRepository
{
	constructor(
		@InjectRepository(UserSessionSchema, ConnectionName.AUTH)
		private readonly entity: TypeOrmRepository<UserSessionSchema>
	) {
		super(entity);
	}

	/**
	 * Find a session by ID.
	 */
	async findById(sessionId: string): Promise<Session | null> {
		const schema = await this.entity.findOne({
			where: { id: sessionId },
		});

		if (!schema) {
			return null;
		}

		return UserMapper.sessionSchemaToVO(schema);
	}

	/**
	 * Find all sessions for a user.
	 */
	async findByUserId(userId: UserId): Promise<Session[]> {
		const schemas = await this.entity.find({
			where: { userId: userId.Value },
		});

		return schemas.map((schema) => UserMapper.sessionSchemaToVO(schema));
	}

	/**
	 * Find only active sessions for a user.
	 * Active = status is "active" AND not revoked AND not expired.
	 */
	async findActiveByUserId(userId: UserId): Promise<Session[]> {
		const now = new Date();

		const schemas = await this.entity.find({
			where: {
				userId: userId.Value,
				status: "active",
			},
		});

		return schemas
			.map((schema) => UserMapper.sessionSchemaToVO(schema))
			.filter((session) => session.isActive);
	}

	/**
	 * Save a session (insert or update).
	 * Session is a VO, so we persist it as part of the aggregate.
	 */
	async save(userId: UserId, session: Session): Promise<void> {
		const schema = UserMapper.sessionVOToSchema(session, userId.Value);

		// Check if exists
		const existing = await this.entity.findOne({
			where: { id: session.id },
		});

		if (existing) {
			await this.entity.update(session.id, {
				status: schema.status,
				lastSeenAt: schema.lastSeenAt,
				expiresAt: schema.expiresAt,
				revokedAt: schema.revokedAt,
			});
		} else {
			await this.entity.save(schema);
		}
	}

	/**
	 * Revoke a specific session.
	 */
	async revoke(sessionId: string): Promise<void> {
		await this.entity.update(sessionId, {
			status: "revoked",
			revokedAt: new Date(),
		});
	}

	/**
	 * Revoke all sessions for a user.
	 */
	async revokeAllByUserId(userId: UserId): Promise<void> {
		await this.entity.update(
			{ userId: userId.Value },
			{
				status: "revoked",
				revokedAt: new Date(),
			}
		);
	}

	/**
	 * Delete expired sessions (cleanup operation).
	 * Returns the number of sessions deleted.
	 */
	async deleteExpired(now = new Date()): Promise<number> {
		const result = await this.entity.delete({
			status: "revoked",
		});

		return result.affected ?? 0;
	}

	/**
	 * Find sessions by refresh family ID (for refresh token rotation).
	 */
	async findByRefreshFamily(refreshFamilyId: string): Promise<Session[]> {
		const schemas = await this.entity.find({
			where: { refreshFamilyId },
		});

		return schemas.map((schema) => UserMapper.sessionSchemaToVO(schema));
	}

	/**
	 * Update last seen time for a session.
	 */
	async touchLastSeen(sessionId: string, now = new Date()): Promise<void> {
		await this.entity.update(sessionId, {
			lastSeenAt: now,
		});
	}

	/**
	 * Get session count for a user (for device limits, etc.).
	 */
	async getActiveSessionCount(userId: UserId): Promise<number> {
		const schemas = await this.entity.find({
			where: { userId: userId.Value },
		});

		return schemas.filter((s) => {
			const vo = UserMapper.sessionSchemaToVO(s);
			return vo.isActive;
		}).length;
	}

	/**
	 * Find sessions by device type for a user.
	 * Useful for "devices" view in account settings.
	 */
	async findByDeviceType(
		userId: UserId,
		deviceType: string
	): Promise<Session[]> {
		const schemas = await this.entity.find({
			where: {
				userId: userId.Value,
				deviceType,
			},
		});

		return schemas.map((schema) => UserMapper.sessionSchemaToVO(schema));
	}

	/**
	 * Delete sessions by device name (user wants to sign out a device).
	 */
	async deleteByDeviceName(userId: UserId, deviceName: string): Promise<void> {
		await this.entity.delete({
			userId: userId.Value,
			deviceName,
		});
	}
}

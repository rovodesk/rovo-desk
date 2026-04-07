import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from "@zero-heads-lab/database";
import { generateCUID } from "@zero-heads-lab/shared/utils";
import { UserIdentitySchema } from "../identity/schema";
import { UserSchema } from "../user/schema";

export type SessionStatus =
	| "active"
	| "revoked"
	| "expired"
	| "ended"
	| "suspended";

@Entity({ name: "session", schema: "auth" })
@Index(["userId"])
@Index(["identityId"])
@Index(["status"])
@Index(["expiresAt"])
@Index(["revokedAt"])
export class UserSessionSchema {
	@PrimaryColumn({ name: "session_id", type: "text" })
	id!: string;

	@Column({ name: "user_id", type: "text" })
	userId!: string;

	@ManyToOne(() => UserSchema, { onDelete: "CASCADE" })
	@JoinColumn({ name: "user_id" })
	user!: UserSchema;

	@Column({ name: "identity_id", type: "text", nullable: true })
	identityId?: string | null;

	@ManyToOne(() => UserIdentitySchema, {
		nullable: true,
		onDelete: "SET NULL",
	})
	@JoinColumn({ name: "identity_id" })
	identity?: UserIdentitySchema | null;

	/**
	 * Durable lifecycle status
	 */
	@Column({ name: "status", type: "text", default: "active" })
	status!: SessionStatus;

	/**
	 * Which provider/identity type created this session
	 * e.g. cognito, google
	 */
	@Column({ name: "provider", type: "text", nullable: true })
	provider?: string | null;

	/**
	 * How the session was authenticated
	 * e.g. password, google, magic_link, mfa
	 */
	@Column({ name: "auth_method", type: "text", nullable: true })
	authMethod?: string | null;

	/**
	 * Increment this to invalidate old cache/auth material
	 * without changing the session id.
	 */
	@Column({ name: "session_version", type: "integer", default: 1 })
	sessionVersion!: number;

	/**
	 * If using opaque server sessions, store only hash — never raw token
	 * Optional if you use JWT-only auth and session lookup by jti/session id
	 */
	@Column({
		name: "session_token_hash",
		type: "text",
		nullable: true,
		unique: true,
	})
	sessionTokenHash?: string | null;

	/**
	 * Refresh token family / rotation chain binding
	 * Useful if one device = one refresh family
	 */
	@Column({ name: "refresh_family_id", type: "text", nullable: true })
	refreshFamilyId?: string | null;

	@Column({ name: "mfa_verified", type: "boolean", default: false })
	mfaVerified!: boolean;

	/**
	 * Whether the current session passed step-up auth recently
	 * Useful for sensitive actions
	 */
	@Column({
		name: "elevated_until",
		type: "timestamptz",
		nullable: true,
	})
	elevatedUntil?: Date | null;

	@Column({ name: "ip_address", type: "text", nullable: true })
	ipAddress?: string | null;

	@Column({ name: "user_agent", type: "text", nullable: true })
	userAgent?: string | null;

	@Column({ name: "device_name", type: "text", nullable: true })
	deviceName?: string | null;

	@Column({ name: "device_type", type: "text", nullable: true })
	deviceType?: string | null;

	@Column({ name: "browser", type: "text", nullable: true })
	browser?: string | null;

	@Column({ name: "os", type: "text", nullable: true })
	os?: string | null;

	@Column({ name: "location", type: "text", nullable: true })
	location?: string | null;

	/**
	 * Session creation / issue time
	 */
	@Column({
		name: "issued_at",
		type: "timestamptz",
		default: () => "CURRENT_TIMESTAMP",
	})
	issuedAt!: Date;

	@Column({
		name: "last_seen_at",
		type: "timestamptz",
	})
	lastSeenAt!: Date;

	/**
	 * Absolute expiry
	 */
	@Column({
		name: "expires_at",
		type: "timestamptz",
	})
	expiresAt!: Date;

	@Column({
		name: "revoked_at",
		type: "timestamptz",
		nullable: true,
	})
	revokedAt?: Date | null;

	/**
	 * Explicit logout / admin revoke / security event
	 */
	@Column({
		name: "revoke_reason",
		type: "text",
		nullable: true,
	})
	revokeReason?: string | null;

	/**
	 * Natural end (logout / replaced / completed)
	 */
	@Column({
		name: "ended_at",
		type: "timestamptz",
		nullable: true,
	})
	endedAt?: Date | null;

	/**
	 * Optional Redis key for fast invalidation / cache lookup
	 * Useful but not authoritative
	 */
	@Column({
		name: "cache_key",
		type: "text",
		nullable: true,
		unique: true,
	})
	cacheKey?: string | null;

	@Column({
		name: "metadata",
		type: "jsonb",
		default: {},
	})
	metadata!: Record<string, unknown>;

	@CreateDateColumn({ name: "created_at", type: "timestamptz" })
	createdAt!: Date;

	@UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
	updatedAt!: Date;

	@BeforeInsert()
	assignDefaults() {
		if (!this.id) {
			this.id = generateCUID("sess"); // Example: sess_c1a2b3d4e5f6g7h8i9j0
		}

		if (!this.status) {
			this.status = "active";
		}

		if (!this.sessionVersion) {
			this.sessionVersion = 1;
		}

		if (!this.issuedAt) {
			this.issuedAt = new Date();
		}

		if (!this.lastSeenAt) {
			this.lastSeenAt = new Date();
		}
	}
}

import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	OneToMany,
	PrimaryColumn,
	UpdateDateColumn,
} from "@zero-heads-lab/database";
import { generateCUID } from "@zero-heads-lab/shared/utils";
import { UserIdentitySchema } from "../identity/schema";

@Entity({ name: "user", schema: "auth" })
export class UserSchema {
	@PrimaryColumn({ type: "text" })
	id!: string;

	@OneToMany(
		() => UserIdentitySchema,
		(identity) => identity.user,
		{
			cascade: ["insert", "update"],
		}
	)
	identities!: UserIdentitySchema[];

	@Column({ name: "first_name", type: "text", nullable: true })
	firstName?: string | null;

	@Column({ name: "last_name", type: "text", nullable: true })
	lastName?: string | null;

	@Column({ name: "avatar_url", type: "text", nullable: true })
	avatarUrl?: string | null;

	@Column({ name: "online", type: "boolean", default: false })
	online!: boolean;

	@Column({
		name: "last_seen_at",
		type: "timestamptz",
		nullable: true,
	})
	lastSeenAt?: Date | null;

	@Column({
		name: "cognito_sub",
		type: "text",
		nullable: true,
		unique: true,
	})
	cognitoSub?: string | null;

	@Column({ name: "banned", type: "boolean", default: false })
	banned!: boolean;

	@Column({ name: "banned_reason", type: "text", nullable: true })
	bannedReason?: string | null;

	@Column({
		name: "banned_at",
		type: "timestamptz",
		nullable: true,
	})
	bannedAt?: Date | null;

	@Column({
		name: "banned_expires_at",
		type: "timestamptz",
		nullable: true,
	})
	bannedExpiresAt?: Date | null;

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

	@DeleteDateColumn({
		name: "deleted_at",
		type: "timestamptz",
		nullable: true,
	})
	deletedAt?: Date | null;

	@BeforeInsert()
	assignDefaults() {
		if (!this.id) {
			this.id = generateCUID("user"); // Example: user_c1a2b3d4e5f6g7h8i9j0
		}
		if (this.online === undefined) this.online = false;
		if (this.banned === undefined) this.banned = false;
	}
}

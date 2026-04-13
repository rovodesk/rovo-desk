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
import { UserSchema } from "./user.schema";

@Entity({ name: "user_identity", schema: "auth" })
@Index(["provider", "providerUserId"], { unique: true })
@Index(["userId"])
export class UserIdentitySchema {
	@PrimaryColumn({ type: "text" })
	id!: string;

	// FK column (IMPORTANT)
	@Column({ name: "user_id", type: "text" })
	userId!: string;

	// Relation
	@ManyToOne(
		() => UserSchema,
		(user) => user.identities,
		{
			onDelete: "CASCADE",
		}
	)
	@JoinColumn({ name: "user_id" })
	user!: UserSchema;

	@Column({ name: "provider", type: "text" })
	provider!: string;

	@Column({ name: "provider_user_id", type: "text" })
	providerUserId!: string;

	@Column({ name: "email", type: "text" })
	email: string;

	@Column({ name: "email_verified", type: "boolean", default: false })
	emailVerified!: boolean;

	@Column({ name: "is_primary", type: "boolean", default: false })
	isPrimary!: boolean;

	@Column({
		name: "last_used_at",
		type: "timestamptz",
		nullable: true,
	})
	lastUsedAt?: Date | null;

	@Column({
		name: "linked_at",
		type: "timestamptz",
		default: () => "CURRENT_TIMESTAMP",
	})
	linkedAt!: Date;

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
	assignId() {
		if (!this.id) {
			this.id = generateCUID("iden"); // Example: iden_c1a2b3d4e5f6g7h8i9j0
		}
	}
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserIdentityResponseModel {
	@ApiProperty({
		example: "iden_x8w3m5q9k2j4p7x1r6n8c0vd",
	})
	id!: string;

	@ApiProperty({
		example: "google",
		description: "The linked authentication provider",
	})
	provider!: string;

	@ApiPropertyOptional({
		example: "dev@example.com",
		description: "Email reported by the provider",
	})
	email?: string | null;

	@ApiProperty({
		example: true,
		description: "Whether the provider-reported email is verified",
	})
	emailVerified!: boolean;

	@ApiProperty({
		example: false,
		description: "Whether this is the canonical/primary login identity",
	})
	isPrimary!: boolean;

	@ApiPropertyOptional({
		type: String,
		format: "date-time",
		example: "2026-04-08T12:00:00.000Z",
		description: "Last time this identity was used to authenticate",
	})
	lastUsedAt?: Date | null;

	@ApiProperty({
		type: String,
		format: "date-time",
		example: "2026-04-01T10:00:00.000Z",
		description: "When this identity was linked to the user account",
	})
	linkedAt!: Date;

	@ApiProperty({
		type: String,
		format: "date-time",
		example: "2026-04-01T10:00:00.000Z",
	})
	createdAt!: Date;

	@ApiProperty({
		type: String,
		format: "date-time",
		example: "2026-04-05T15:30:00.000Z",
	})
	updatedAt!: Date;
}

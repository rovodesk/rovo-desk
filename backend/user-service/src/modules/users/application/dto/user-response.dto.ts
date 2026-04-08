import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class IdentityDto {
	@ApiProperty({ example: "google" })
	provider!: string;

	@ApiProperty({ example: "user_12345" })
	providerUserId!: string;

	@ApiPropertyOptional({ example: "user@example.com" })
	email?: string | null;

	@ApiProperty({ example: true })
	isPrimary!: boolean;

	@ApiProperty({ example: "2026-04-01T10:00:00.000Z" })
	linkedAt!: Date;
}

export class SessionDto {
	@ApiProperty({ example: "session_abc123" })
	id!: string;

	@ApiProperty({ example: "active" })
	status!: string;

	@ApiProperty({ example: "2026-04-01T10:00:00.000Z" })
	createdAt!: Date;

	@ApiProperty({ example: "2026-04-08T12:00:00.000Z" })
	lastSeenAt!: Date;

	@ApiProperty({ example: "2026-04-15T10:00:00.000Z" })
	expiresAt!: Date;

	@ApiPropertyOptional({ example: null })
	revokedAt?: Date | null;
}

export class UserResponseDto {
	@ApiProperty({ example: "usr_abc123xyz" })
	id!: string;

	@ApiProperty({ example: "user@example.com" })
	email!: string;

	@ApiProperty({ example: true })
	emailVerified!: boolean;

	@ApiProperty({ example: "active" })
	status!: string;

	@ApiProperty({ type: [IdentityDto] })
	identities!: IdentityDto[];

	@ApiProperty({ type: [SessionDto] })
	sessions!: SessionDto[];

	@ApiProperty({ example: "2026-04-01T10:00:00.000Z" })
	createdAt!: Date;

	@ApiProperty({ example: "2026-04-05T15:30:00.000Z" })
	updatedAt!: Date;
}

export class CreateUserRequestDto {
	@ApiProperty({ example: "user@example.com" })
	email!: string;

	@ApiProperty({ example: "google" })
	provider!: string;

	@ApiProperty({ example: "user_12345" })
	providerUserId!: string;

	@ApiPropertyOptional({ example: true })
	isPrimary?: boolean;
}

export class UpdateEmailRequestDto {
	@ApiProperty({ example: "newemail@example.com" })
	email!: string;
}

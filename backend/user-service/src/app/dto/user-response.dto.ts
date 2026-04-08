import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserResponseModel {
	@ApiProperty({
		example: "usr_abc123xyz",
	})
	id!: string;

	@ApiProperty({
		example: [],
	})
	// biome-ignore lint/suspicious/noExplicitAny: Identies can be of any type depending on the authentication provider
	identities!: any[];

	@ApiPropertyOptional({
		example: "John",
	})
	firstName?: string | null;

	@ApiPropertyOptional({
		example: "Doe",
	})
	lastName?: string | null;

	@ApiPropertyOptional({
		example: "https://api.dicebear.com/9.x/avataaars/svg?seed=JohnDoe",
	})
	avatarUrl?: string | null;

	@ApiProperty({
		example: false,
	})
	online!: boolean;

	@ApiPropertyOptional({
		example: "2026-04-08T12:00:00.000Z",
		type: String,
		format: "date-time",
	})
	lastSeenAt?: Date | null;

	@ApiProperty({
		example: false,
	})
	banned!: boolean;

	@ApiProperty({
		example: "2026-04-01T10:00:00.000Z",
		type: String,
		format: "date-time",
	})
	createdAt!: Date;

	@ApiProperty({
		example: "2026-04-05T15:30:00.000Z",
		type: String,
		format: "date-time",
	})
	updatedAt!: Date;
}

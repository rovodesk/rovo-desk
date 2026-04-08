import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsGeneratedCUID } from "@zero-heads-lab/global/validators";
import {
	IsBoolean,
	IsEmail,
	IsIn,
	IsOptional,
	IsString,
	MaxLength,
} from "class-validator";

export class CreateUserIdentityDto {
	@ApiProperty({
		example: "user_x8w3m5q9k2j4p7x1r6n8c0vd",
		description: "Internal user id to attach this identity to",
	})
	@IsGeneratedCUID()
	userId!: string;

	@ApiProperty({
		example: "google",
		description: "Authentication provider",
		enum: ["cognito", "google", "apple", "oidc", "saml"],
	})
	@IsString()
	@IsIn(["cognito", "google", "apple", "oidc", "saml"])
	provider!: string;

	@ApiProperty({
		example: "117839293920392",
		description: "Provider-specific stable user identifier",
	})
	@IsString()
	@MaxLength(255)
	providerUserId!: string;

	@ApiPropertyOptional({
		example: "dev@example.com",
		description: "Email reported by the provider",
	})
	@IsOptional()
	@IsEmail()
	email?: string | null;

	@ApiPropertyOptional({
		example: true,
		description: "Whether the provider-reported email is verified",
	})
	@IsOptional()
	@IsBoolean()
	emailVerified?: boolean;

	@ApiPropertyOptional({
		example: false,
		description: "Whether this should be the primary identity",
	})
	@IsOptional()
	@IsBoolean()
	isPrimary?: boolean;
}

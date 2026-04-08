import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsEmail,
	IsIn,
	IsOptional,
	IsString,
	MaxLength,
} from "class-validator";

export class LinkUserIdentityDto {
	@ApiProperty({
		example: "google",
		description: "Provider to link to the current user",
		enum: ["cognito", "google", "apple", "oidc", "saml"],
	})
	@IsString()
	@IsIn(["cognito", "google", "apple", "oidc", "saml"])
	provider!: string;

	@ApiProperty({
		example: "117839293920392",
		description: "Provider-specific stable subject / user id",
	})
	@IsString()
	@MaxLength(255)
	providerUserId!: string;

	@ApiPropertyOptional({
		example: "dev@example.com",
		description: "Provider-reported email",
	})
	@IsOptional()
	@IsEmail()
	email?: string | null;

	@ApiPropertyOptional({
		example: true,
		description: "Whether the provider email is verified",
	})
	@IsOptional()
	emailVerified?: boolean;
}

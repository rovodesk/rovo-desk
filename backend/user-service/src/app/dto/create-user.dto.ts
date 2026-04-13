import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsGeneratedCUID } from "@zero-heads-lab/global/validators";
import {
	IsEmail,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
	MaxLength,
} from "class-validator";

export class CreateUserDto {
	@ApiProperty({
		example: "user_abc123xyz",
		description:
			"Unique identifier for the user (e.g., user_c1a2b3d4e5f6g7h8i9j0)",
	})
	@IsNotEmpty()
	@IsGeneratedCUID()
	id!: string;

	@ApiProperty({
		example: "johndoe@rovodesk.app",
		description: "The email address of the user",
	})
	@IsEmail()
	@IsNotEmpty()
	email!: string;

	@ApiPropertyOptional({
		example: "John",
		description: "The first name of the user",
	})
	@IsOptional()
	@IsString()
	@MaxLength(100)
	firstName?: string;

	@ApiPropertyOptional({
		example: "Doe",
		description: "The last name of the user",
	})
	@IsOptional()
	@IsString()
	@MaxLength(100)
	lastName?: string;

	@ApiPropertyOptional({
		example: "https://api.dicebear.com/9.x/avataaars/svg?seed=JohnDoe",
		description: "The URL of the user's avatar",
	})
	@IsOptional()
	@IsString()
	avatarUrl?: string;

	@ApiPropertyOptional({
		example: {},
		description: "Additional metadata for the user",
	})
	@IsOptional()
	@IsObject()
	metadata?: Record<string, unknown>;
}

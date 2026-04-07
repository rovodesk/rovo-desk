import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsGeneratedCUID } from "@zero-heads-lab/global/validators";
import {
	IsBoolean,
	IsDateString,
	IsIP,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from "class-validator";

export class CreateSessionDto {
	@ApiProperty({
		example: "user_x8w3m5q9k2j4p7x1r6n8c0vd",
	})
	@IsGeneratedCUID()
	userId!: string;

	@ApiPropertyOptional({
		example: "google",
	})
	@IsOptional()
	@IsString()
	@MaxLength(50)
	provider?: string | null;

	@ApiPropertyOptional({
		example: "google",
		description: "password, google, magic_link, mfa, etc.",
	})
	@IsOptional()
	@IsString()
	@MaxLength(50)
	authMethod?: string | null;

	@ApiPropertyOptional({
		example: true,
	})
	@IsOptional()
	@IsBoolean()
	mfaVerified?: boolean;

	@ApiPropertyOptional({
		example: "Chrome on MacBook Pro",
	})
	@IsOptional()
	@IsString()
	@MaxLength(255)
	deviceName?: string | null;

	@ApiPropertyOptional({
		example: "web",
	})
	@IsOptional()
	@IsString()
	@MaxLength(50)
	deviceType?: string | null;

	@ApiPropertyOptional({
		example: "Chrome",
	})
	@IsOptional()
	@IsString()
	@MaxLength(100)
	browser?: string | null;

	@ApiPropertyOptional({
		example: "macOS",
	})
	@IsOptional()
	@IsString()
	@MaxLength(100)
	os?: string | null;

	@ApiPropertyOptional({
		example: "New York, US",
	})
	@IsOptional()
	@IsString()
	@MaxLength(255)
	location?: string | null;

	@ApiPropertyOptional({
		example: "203.0.113.10",
	})
	@IsOptional()
	@IsIP()
	ipAddress?: string | null;

	@ApiPropertyOptional({
		example: "Mozilla/5.0 ...",
	})
	@IsOptional()
	@IsString()
	@MaxLength(2000)
	userAgent?: string | null;

	@ApiProperty({
		example: "2026-05-01T12:00:00.000Z",
	})
	@IsDateString()
	@IsNotEmpty()
	expiresAt!: string;
}

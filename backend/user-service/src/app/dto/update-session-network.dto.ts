import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIP, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateSessionNetworkDto {
	@ApiPropertyOptional({
		example: "203.0.113.10",
	})
	@IsOptional()
	@IsIP()
	ipAddress?: string | null;

	@ApiPropertyOptional({
		example: "Kolkata, IN",
	})
	@IsOptional()
	@IsString()
	@MaxLength(255)
	location?: string | null;

	@ApiPropertyOptional({
		example: "Mozilla/5.0 ...",
	})
	@IsOptional()
	@IsString()
	@MaxLength(2000)
	userAgent?: string | null;
}

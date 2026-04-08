import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateSessionDeviceDto {
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
}

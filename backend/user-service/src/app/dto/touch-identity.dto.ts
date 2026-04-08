import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class TouchIdentityDto {
	@ApiPropertyOptional({
		example: "2026-04-08T12:00:00.000Z",
		description: "Last time this identity was used for authentication",
	})
	@IsOptional()
	@IsDateString()
	lastUsedAt?: string;
}

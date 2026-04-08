import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class TouchSessionDto {
	@ApiPropertyOptional({
		example: "2026-04-08T12:00:00.000Z",
		description: "Last activity timestamp",
	})
	@IsOptional()
	@IsDateString()
	lastSeenAt?: string;
}

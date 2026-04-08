import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";

export class UnlinkUserIdentityDto {
	@ApiPropertyOptional({
		example: "user_request",
		description: "Reason for unlinking",
		enum: [
			"user_request",
			"admin_action",
			"security_event",
			"provider_disconnected",
		],
	})
	@IsOptional()
	@IsString()
	@IsIn([
		"user_request",
		"admin_action",
		"security_event",
		"provider_disconnected",
	])
	reason?: string;
}

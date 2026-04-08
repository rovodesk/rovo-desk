import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsIn, IsOptional, IsString } from "class-validator";

export class RevokeAllSessionsDto {
	@ApiPropertyOptional({
		example: true,
		description: "Whether to keep the caller's current session active",
	})
	@IsOptional()
	@IsBoolean()
	excludeCurrent?: boolean;

	@ApiPropertyOptional({
		example: "logout_all",
		enum: [
			"logout_all",
			"admin_revoke",
			"security_event",
			"suspicious_activity",
			"password_changed",
		],
	})
	@IsOptional()
	@IsString()
	@IsIn([
		"logout_all",
		"admin_revoke",
		"security_event",
		"suspicious_activity",
		"password_changed",
	])
	revokeReason?: string;
}

import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";

export class RevokeSessionDto {
	@ApiPropertyOptional({
		example: "user_logout",
		description: "Reason for revocation. Useful for audit/security tracking.",
		enum: [
			"user_logout",
			"logout_all",
			"admin_revoke",
			"security_event",
			"token_reuse",
			"suspicious_activity",
		],
	})
	@IsOptional()
	@IsString()
	@IsIn([
		"user_logout",
		"logout_all",
		"admin_revoke",
		"security_event",
		"token_reuse",
		"suspicious_activity",
	])
	revokeReason?: string;
}

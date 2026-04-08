import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class ElevateSessionDto {
	@ApiProperty({
		example: true,
		description: "Whether MFA/step-up auth is verified",
	})
	@IsBoolean()
	mfaVerified!: boolean;
}

import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional } from "class-validator";

export class UpdateEmailDto {
	@ApiPropertyOptional({
		example: "dev@example.com",
		description: "Updated provider-reported email",
	})
	@IsOptional()
	@IsEmail()
	email?: string | null;
}

import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { IsGeneratedCUID } from "@zero-heads-lab/global/validators";
import { IsNotEmpty } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(
	OmitType(CreateUserDto, ["id"])
) {
	@ApiProperty({
		example: "user_abc123xyz",
		description:
			"Unique identifier for the user (e.g., user_c1a2b3d4e5f6g7h8i9j0)",
	})
	@IsNotEmpty()
	@IsGeneratedCUID()
	id!: string;
}

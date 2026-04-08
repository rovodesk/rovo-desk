import { ApiProperty } from "@nestjs/swagger";
import { IsGeneratedCUID } from "@zero-heads-lab/global/validators";

export class SetPrimaryIdentityDto {
	@ApiProperty({
		example: "iden_x8w3m5q9k2j4p7x1r6n8c0vd",
		description: "Identity id to set as the primary login identity",
	})
	@IsGeneratedCUID()
	identityId!: string;
}

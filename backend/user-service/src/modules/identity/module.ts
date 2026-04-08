import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConnectionName } from "@zero-heads-lab/database/types";

import { IdentityController } from "./controller";
import { UserIdentitySchema } from "./schema";

@Module({
	imports: [
		TypeOrmModule.forFeature([UserIdentitySchema], ConnectionName.AUTH),
	],
	// providers: [
	// 	{
	// 		provide: IIdentityRepository,
	// 		useClass: IdentityRepository,
	// 	},
	// ],
	controllers: [IdentityController],
	// exports: [IIdentityRepository],
})
export class IdentityModule {}

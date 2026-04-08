import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConnectionName } from "@zero-heads-lab/database/types";

import { IUserRepository } from "./adapter";
import { UserRepository } from "./repository";
import { UserSchema } from "./schema";

@Module({
	imports: [TypeOrmModule.forFeature([UserSchema], ConnectionName.AUTH)],
	providers: [
		{
			provide: IUserRepository,
			useClass: UserRepository,
		},
	],
	exports: [IUserRepository],
})
export class UserModule {}

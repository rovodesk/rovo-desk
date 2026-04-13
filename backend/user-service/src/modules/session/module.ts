import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConnectionName } from "@zero-heads-lab/database/types";

import { SessionController } from "./controller";
import { UserSessionSchema } from "./schema";

@Module({
	imports: [TypeOrmModule.forFeature([UserSessionSchema], ConnectionName.AUTH)],
	// providers: [
	// 	{
	// 		provide: ISessionRepository,
	// 		useClass: SessionRepository,
	// 	},
	// ],
	controllers: [SessionController],
	// exports: [ISessionRepository],
})
export class SessionModule {}

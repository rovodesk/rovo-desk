import { Module } from "@nestjs/common";
import { AuthDatabaseModule } from "@zero-heads-lab/global/infra";
import { IHealthService } from "./adapter";
import { HealthController } from "./controller";
import { HealthService } from "./service";

@Module({
	imports: [AuthDatabaseModule],
	controllers: [HealthController],
	providers: [
		{
			provide: IHealthService,
			useClass: HealthService,
		},
	],
})
export class HealthModule {}

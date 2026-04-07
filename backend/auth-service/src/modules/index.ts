import {
	type MiddlewareConsumer,
	Module,
	type NestModule,
	RequestMethod,
} from "@nestjs/common";
import {
	AuthDatabaseModule,
	ObservabilityModule,
} from "@zero-heads-lab/global/infra";
import {
	LoggerContextMiddleware,
	TracerContextMiddleware,
} from "@zero-heads-lab/global/middlewares";
import { HealthModule } from "./health/module";
import { IdentityModule } from "./identity/module";
import { SessionModule } from "./session/module";
import { UserModule } from "./user/module";

const InfraModules = [
	ObservabilityModule.forRootAsync({
		app: "rovodesk-auth-api",
		version: "1.0.0",
	}),
	AuthDatabaseModule,
	HealthModule,
];
const DomainModules = [UserModule, IdentityModule, SessionModule];

@Module({
	imports: [...InfraModules, ...DomainModules],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(LoggerContextMiddleware, TracerContextMiddleware)
			.forRoutes({ path: "*", method: RequestMethod.ALL });
	}
}

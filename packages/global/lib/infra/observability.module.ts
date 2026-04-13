import { type DynamicModule, Global, Module } from "@nestjs/common";
import { ISecrets } from "@zero-heads-lab/secrets";
import { LoggerModule } from "./logger.module.js";
import { TracerModule } from "./tracer.module.js";

type ObservabilityModuleOptions = {
	app: string;
	version: string;
};

@Global()
@Module({})
export class ObservabilityModule {
	static forRootAsync(
		// biome-ignore lint/suspicious/noExplicitAny: Any can be passed to the factory function
		options: ObservabilityModuleOptions & { inject?: any[] }
	): DynamicModule {
		return {
			module: ObservabilityModule,
			global: true,
			imports: [
				TracerModule.forRoot({
					app: options.app,
					version: options.version,
				}),
				LoggerModule.forRootAsync({
					inject: [ISecrets, ...(options.inject ?? [])],
					useFactory: (secrets: ISecrets) => ({
						app: options.app,
						version: options.version,
						level: secrets.LOG_LEVEL as
							| "trace"
							| "debug"
							| "info"
							| "warn"
							| "error"
							| "fatal",
						otlpUrl: `${secrets.OTLP_COLLECTOR_URL}/v1/logs`,
						redactKeys: [
							"password",
							"token",
							"accessToken",
							"refreshToken",
							"authorization",
							"cookie",
							"idToken",
							"secret",
						],
					}),
				}),
			],
			exports: [TracerModule, LoggerModule],
		};
	}
}

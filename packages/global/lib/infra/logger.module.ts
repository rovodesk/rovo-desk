/** biome-ignore-all lint/suspicious/noExplicitAny: Any can be passed to the factory function */
import {
	type DynamicModule,
	Global,
	Module,
	type Provider,
} from "@nestjs/common";
import {
	ILogger,
	Logger,
	type LoggerOptions,
} from "@zero-heads-lab/observability";

export type LoggerModuleOptions = LoggerOptions & {
	isGlobal?: boolean;
};

export type LoggerModuleAsyncOptions = {
	isGlobal?: boolean;
	inject?: any[];
	useFactory: (...args: any[]) =>
		| Promise<
				Omit<LoggerOptions, "app" | "version"> & {
					app: string;
					version: string;
				}
		  >
		| (Omit<LoggerOptions, "app" | "version"> & {
				app: string;
				version: string;
		  });
};

@Global()
@Module({})
export class LoggerModule {
	static forRoot(options: LoggerModuleOptions): DynamicModule {
		const loggerProvider: Provider = {
			provide: ILogger,
			useFactory: (): ILogger => {
				return new Logger({
					app: options.app,
					version: options.version,
					level: options.level,
					otlpUrl: options.otlpUrl,
					redactKeys: options.redactKeys,
				});
			},
		};

		return {
			module: LoggerModule,
			global: options.isGlobal ?? true,
			providers: [loggerProvider],
			exports: [ILogger],
		};
	}

	static forRootAsync(options: LoggerModuleAsyncOptions): DynamicModule {
		const loggerProvider: Provider = {
			provide: ILogger,
			useFactory: async (...args: any[]): Promise<ILogger> => {
				const config = await options.useFactory(...args);

				return new Logger({
					app: config.app,
					version: config.version,
					level: config.level,
					otlpUrl: config.otlpUrl,
					redactKeys: config.redactKeys,
				});
			},
			inject: options.inject ?? [],
		};

		return {
			module: LoggerModule,
			global: options.isGlobal ?? true,
			providers: [loggerProvider],
			exports: [ILogger],
		};
	}
}

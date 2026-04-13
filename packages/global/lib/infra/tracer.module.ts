/** biome-ignore-all lint/suspicious/noExplicitAny: Anything could be passed to the factory function */
import {
	type DynamicModule,
	Global,
	Module,
	type Provider,
} from "@nestjs/common";
import { createTracer, ITracer } from "@zero-heads-lab/observability";

export type TracerModuleOptions = {
	app: string;
	version: string;
};

export type TracerModuleAsyncOptions = {
	isGlobal?: boolean;
	inject?: any[];
	useFactory: (
		...args: any[]
	) => Promise<TracerModuleOptions> | TracerModuleOptions;
};

@Global()
@Module({})
export class TracerModule {
	static forRoot(
		options: TracerModuleOptions & { isGlobal?: boolean }
	): DynamicModule {
		const tracerProvider: Provider = {
			provide: ITracer,
			useFactory: (): ITracer => {
				return createTracer({
					app: options.app,
					version: options.version,
				});
			},
		};

		return {
			module: TracerModule,
			global: options.isGlobal ?? true,
			providers: [tracerProvider],
			exports: [ITracer],
		};
	}

	static forRootAsync(options: TracerModuleAsyncOptions): DynamicModule {
		const tracerProvider: Provider = {
			provide: ITracer,
			useFactory: async (...args: any[]): Promise<ITracer> => {
				const config = await options.useFactory(...args);

				return createTracer({
					app: config.app,
					version: config.version,
				});
			},
			inject: options.inject ?? [],
		};

		return {
			module: TracerModule,
			global: options.isGlobal ?? true,
			providers: [tracerProvider],
			exports: [ITracer],
		};
	}
}

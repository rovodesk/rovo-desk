// secrets.module.ts
/** biome-ignore-all lint/suspicious/noExplicitAny: Any can be passed to factory */
import {
	type DynamicModule,
	Global,
	Module,
	type Provider,
} from "@nestjs/common";
import { ISecrets, SecretStore } from "@zero-heads-lab/secrets";

export type SecretsModuleOptions = {
	env?: NodeJS.ProcessEnv;
	isGlobal?: boolean;
};

export type SecretsModuleAsyncOptions = {
	isGlobal?: boolean;
	inject?: any[];
	useFactory: (
		...args: any[]
	) => Promise<NodeJS.ProcessEnv> | NodeJS.ProcessEnv;
};

@Global()
@Module({})
export class SecretsModule {
	static forRoot(options: SecretsModuleOptions = {}): DynamicModule {
		const secretsProvider: Provider = {
			provide: ISecrets,
			useFactory: (): ISecrets => {
				return new SecretStore(options.env ?? process.env);
			},
		};

		return {
			module: SecretsModule,
			global: options.isGlobal ?? true,
			providers: [secretsProvider],
			exports: [ISecrets],
		};
	}

	static forRootAsync(options: SecretsModuleAsyncOptions): DynamicModule {
		const secretsProvider: Provider = {
			provide: ISecrets,
			useFactory: async (...args: any[]): Promise<ISecrets> => {
				const env = await options.useFactory(...args);
				return new SecretStore(env);
			},
			inject: options.inject ?? [],
		};

		return {
			module: SecretsModule,
			global: options.isGlobal ?? true,
			providers: [secretsProvider],
			exports: [ISecrets],
		};
	}
}

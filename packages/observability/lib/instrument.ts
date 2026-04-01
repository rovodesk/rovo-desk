/**
 * Only use this if you are not using Cloudflare Native observability
 *
 * @deprecated
 */
import { instrument, type ResolveConfigFn } from "@microlabs/otel-cf-workers";

export type InstrumentationEnv = {
	AXIOM_DOMAIN: string;
	AXIOM_TOKEN: string;
	AXIOM_DATASET: string;
	CLOUDFLARE_ENV?: string;
	SERVICE_NAME?: string;
	SERVICE_VERSION?: string;
};

export const resolveOtelConfig = <
	T extends InstrumentationEnv,
>(): ResolveConfigFn<T> => {
	return (env: T, _trigger) => {
		return {
			exporter: {
				url: `https://${env.AXIOM_DOMAIN}/v1/traces`,
				headers: {
					Authorization: `Bearer ${env.AXIOM_TOKEN}`,
					"X-Axiom-Dataset": env.AXIOM_DATASET,
				},
			},
			service: {
				name: env.SERVICE_NAME ?? "cloudflare-worker",
				version: env.SERVICE_VERSION ?? "1.0.0",
			},
		};
	};
};

export function startInstrumentation<T extends InstrumentationEnv>(
	handler: ExportedHandler<T, unknown, unknown, unknown>
) {
	return instrument(handler, resolveOtelConfig<T>());
}

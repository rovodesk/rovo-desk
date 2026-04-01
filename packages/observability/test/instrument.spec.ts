import { instrument } from "@microlabs/otel-cf-workers";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	type InstrumentationEnv,
	resolveOtelConfig,
	startInstrumentation,
} from "../lib/instrument";

vi.mock("@microlabs/otel-cf-workers", () => ({
	instrument: vi.fn(),
}));

describe("resolveOtelConfig", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns exporter and service config from env", () => {
		const resolver = resolveOtelConfig<InstrumentationEnv>();

		const env: InstrumentationEnv = {
			AXIOM_DOMAIN: "api.axiom.co",
			AXIOM_TOKEN: "secret-token",
			AXIOM_DATASET: "worker-traces",
			SERVICE_NAME: "auth-service",
			SERVICE_VERSION: "2.1.0",
		};

		const config = resolver(env, {} as never);

		expect(config).toEqual({
			exporter: {
				url: "https://api.axiom.co/v1/traces",
				headers: {
					Authorization: "Bearer secret-token",
					"X-Axiom-Dataset": "worker-traces",
				},
			},
			service: {
				name: "auth-service",
				version: "2.1.0",
			},
		});
	});

	it("uses default service name and version when not provided", () => {
		const resolver = resolveOtelConfig<InstrumentationEnv>();

		const env: InstrumentationEnv = {
			AXIOM_DOMAIN: "api.axiom.co",
			AXIOM_TOKEN: "secret-token",
			AXIOM_DATASET: "worker-traces",
		};

		const config = resolver(env, {} as never);

		expect(config).toEqual({
			exporter: {
				url: "https://api.axiom.co/v1/traces",
				headers: {
					Authorization: "Bearer secret-token",
					"X-Axiom-Dataset": "worker-traces",
				},
			},
			service: {
				name: "cloudflare-worker",
				version: "1.0.0",
			},
		});
	});

	it("ignores the trigger argument", () => {
		const resolver = resolveOtelConfig<InstrumentationEnv>();

		const env: InstrumentationEnv = {
			AXIOM_DOMAIN: "custom.axiom.dev",
			AXIOM_TOKEN: "token-123",
			AXIOM_DATASET: "dataset-abc",
			SERVICE_NAME: "payments-worker",
			SERVICE_VERSION: "3.4.5",
		};

		const triggerA = { type: "fetch" };
		const triggerB = { type: "scheduled" };

		const configA = resolver(env, triggerA as never);
		const configB = resolver(env, triggerB as never);

		expect(configA).toEqual(configB);
	});
});

describe("startInstrumentation", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("calls instrument with the handler and resolved config", () => {
		const handler = {
			fetch() {
				return new Response("ok");
			},
		} satisfies ExportedHandler<InstrumentationEnv>;

		const wrappedHandler = {
			fetch() {
				return new Response("wrapped");
			},
		};

		vi.mocked(instrument).mockReturnValue(wrappedHandler as typeof handler);

		const result = startInstrumentation(handler);

		expect(instrument).toHaveBeenCalledTimes(1);

		const [passedHandler, passedResolver] =
			vi.mocked(instrument).mock.calls[0] ?? [];

		expect(passedHandler).toBe(handler);
		expect(typeof passedResolver).toBe("function");

		const env: InstrumentationEnv = {
			AXIOM_DOMAIN: "api.axiom.co",
			AXIOM_TOKEN: "secret-token",
			AXIOM_DATASET: "worker-traces",
			SERVICE_NAME: "auth-service",
			SERVICE_VERSION: "2.1.0",
		};

		const resolver = passedResolver as ReturnType<
			typeof resolveOtelConfig<InstrumentationEnv>
		>;

		expect(resolver(env, {} as never)).toEqual({
			exporter: {
				url: "https://test.otlp.collector/v1/traces",
				headers: {
					Authorization: "Bearer secret-token",
					"X-Dataset": "worker-traces",
				},
			},
			service: {
				name: "auth-service",
				version: "2.1.0",
			},
		});

		expect(result).toBe(wrappedHandler);
	});

	it("returns the instrumented handler from instrument()", () => {
		const handler = {
			fetch() {
				return new Response("ok");
			},
		} satisfies ExportedHandler<InstrumentationEnv>;

		const wrappedHandler = {
			fetch() {
				return new Response("instrumented");
			},
		};

		vi.mocked(instrument).mockReturnValue(wrappedHandler as typeof handler);

		const result = startInstrumentation(handler);

		expect(result).toBe(wrappedHandler);
	});
});

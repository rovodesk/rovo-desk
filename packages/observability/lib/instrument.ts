import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
	AlwaysOffSampler,
	AlwaysOnSampler,
	BatchSpanProcessor,
	ParentBasedSampler,
	TraceIdRatioBasedSampler,
} from "@opentelemetry/sdk-trace-base";
import {
	ATTR_SERVICE_INSTANCE_ID,
	ATTR_SERVICE_NAME,
	ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { ATTR_DEPLOYMENT_ENVIRONMENT_NAME } from "@opentelemetry/semantic-conventions/incubating";

export type InstrumentationEnv = {
	OTEL_EXPORTER_OTLP_ENDPOINT?: string;

	OTEL_EXPORTER_OTLP_TRACES_ENDPOINT?: string;
	OTEL_EXPORTER_OTLP_METRICS_ENDPOINT?: string;
	OTEL_EXPORTER_OTLP_LOGS_ENDPOINT?: string;

	OTEL_EXPORTER_OTLP_HEADERS?: string;

	OTEL_SERVICE_NAME?: string;
	OTEL_SERVICE_VERSION?: string;
	OTEL_ENVIRONMENT?: string;

	OTEL_LOG_LEVEL?:
		| "NONE"
		| "ERROR"
		| "WARN"
		| "INFO"
		| "DEBUG"
		| "VERBOSE"
		| "ALL";

	OTEL_TRACES_SAMPLER?:
		| "always_on"
		| "always_off"
		| "parentbased_always_on"
		| "parentbased_always_off"
		| "traceId_ratio";

	OTEL_TRACES_SAMPLER_ARG?: string;

	HOSTNAME?: string;
};

export type InstrumentationOptions = {
	env: InstrumentationEnv;
	enableExpress?: boolean;
	enableRuntimeDiag?: boolean;
};

let sdk: NodeSDK | null = null;
let started = false;

function parseHeaders(headerString?: string): Record<string, string> {
	if (!headerString) return {};

	return Object.fromEntries(
		headerString
			.split(",")
			.map((pair) => pair.trim())
			.filter(Boolean)
			.map((pair) => {
				const [key, ...rest] = pair.split("=");
				return [key.trim(), rest.join("=").trim()];
			})
	);
}

function resolveBaseEndpoint(env: InstrumentationEnv): string {
	return env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "http://localhost:4318";
}

function resolveTraceEndpoint(env: InstrumentationEnv): string {
	return (
		env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ??
		`${resolveBaseEndpoint(env)}/v1/traces`
	);
}

function resolveMetricEndpoint(env: InstrumentationEnv): string {
	return (
		env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT ??
		`${resolveBaseEndpoint(env)}/v1/metrics`
	);
}

function resolveLogEndpoint(env: InstrumentationEnv): string {
	return (
		env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT ??
		`${resolveBaseEndpoint(env)}/v1/logs`
	);
}

function resolveSampler(env: InstrumentationEnv) {
	const sampler = env.OTEL_TRACES_SAMPLER ?? "always_on";
	const ratio = Number(env.OTEL_TRACES_SAMPLER_ARG ?? "1");

	switch (sampler) {
		case "always_on":
			return new AlwaysOnSampler();

		case "always_off":
			return new AlwaysOffSampler();

		case "parentbased_always_off":
			return new ParentBasedSampler({
				root: new AlwaysOffSampler(),
			});

		case "parentbased_always_on":
			return new ParentBasedSampler({
				root: new AlwaysOnSampler(),
			});

		case "traceId_ratio":
			return new ParentBasedSampler({
				root: new TraceIdRatioBasedSampler(Number.isFinite(ratio) ? ratio : 1),
			});

		default:
			return new ParentBasedSampler({
				root: new AlwaysOnSampler(),
			});
	}
}

function resolveDiagLevel(
	level?: InstrumentationEnv["OTEL_LOG_LEVEL"]
): DiagLogLevel {
	switch (level) {
		case "ALL":
			return DiagLogLevel.ALL;
		case "VERBOSE":
			return DiagLogLevel.VERBOSE;
		case "DEBUG":
			return DiagLogLevel.DEBUG;
		case "INFO":
			return DiagLogLevel.INFO;
		case "WARN":
			return DiagLogLevel.WARN;
		case "ERROR":
			return DiagLogLevel.ERROR;
		default:
			return DiagLogLevel.NONE;
	}
}

export async function startInstrumentation(
	options: InstrumentationOptions
): Promise<NodeSDK> {
	if (started && sdk) {
		return sdk;
	}

	const { env, enableExpress = false, enableRuntimeDiag = false } = options;

	if (enableRuntimeDiag) {
		diag.setLogger(
			new DiagConsoleLogger(),
			resolveDiagLevel(env.OTEL_LOG_LEVEL)
		);
	}

	const headers = parseHeaders(env.OTEL_EXPORTER_OTLP_HEADERS);

	const resource = resourceFromAttributes({
		[ATTR_SERVICE_NAME]: env.OTEL_SERVICE_NAME ?? "node-service",
		[ATTR_SERVICE_VERSION]: env.OTEL_SERVICE_VERSION ?? "1.0.0",
		[ATTR_DEPLOYMENT_ENVIRONMENT_NAME]:
			env.OTEL_ENVIRONMENT ?? process.env.NODE_ENV ?? "development",
		[ATTR_SERVICE_INSTANCE_ID]:
			env.HOSTNAME ?? process.env.HOSTNAME ?? "unknown-instance",
	});

	const traceExporter = new OTLPTraceExporter({
		url: resolveTraceEndpoint(env),
		headers,
	});

	const metricExporter = new OTLPMetricExporter({
		url: resolveMetricEndpoint(env),
		headers,
	});

	const logExporter = new OTLPLogExporter({
		url: resolveLogEndpoint(env),
		headers,
	});

	const instrumentations = [
		new HttpInstrumentation({
			ignoreIncomingRequestHook: (req) => {
				const url = req.url ?? "";
				return (
					url.includes("/health") ||
					url.includes("/ready") ||
					url.includes("/metrics")
				);
			},
		}),
		new UndiciInstrumentation(),
		...(enableExpress ? [new ExpressInstrumentation()] : []),
	];

	sdk = new NodeSDK({
		resource,
		sampler: resolveSampler(env),

		traceExporter,
		spanProcessors: [new BatchSpanProcessor(traceExporter)],

		metricReader: new PeriodicExportingMetricReader({
			exporter: metricExporter,
			exportIntervalMillis: 10_000,
		}),

		logRecordProcessors: [new BatchLogRecordProcessor(logExporter)],

		instrumentations,
	});

	await sdk.start();
	started = true;

	const shutdown = async () => {
		if (!sdk) return;

		try {
			await sdk.shutdown();
		} catch {
			// swallow shutdown errors
		} finally {
			sdk = null;
			started = false;
		}
	};

	process.once("SIGTERM", () => {
		shutdown();
	});

	process.once("SIGINT", () => {
		shutdown();
	});

	return sdk;
}

export async function stopInstrumentation(): Promise<void> {
	if (!sdk) return;

	try {
		await sdk.shutdown();
	} finally {
		sdk = null;
		started = false;
	}
}

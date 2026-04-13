import { request } from "node:http";
import { request as httpsRequest } from "node:https";
import { URL } from "node:url";

export type OTLPExporterOptions = {
	url: string;
	batchSize?: number;
	flushIntervalMs?: number;
	timeoutMs?: number;
	headers?: Record<string, string>;
	resourceAttributes?: Record<string, string>;
};

type OTLPLogRecord = {
	timeUnixNano: string;
	severityText: string;
	body: { stringValue: string };
	attributes: { key: string; value: OTLPAnyValue }[];
};

type OTLPAnyValue =
	| { stringValue: string }
	| { intValue: number }
	| { doubleValue: number }
	| { boolValue: boolean };

function toOTLPValue(value: unknown): OTLPAnyValue {
	if (typeof value === "string") return { stringValue: value };
	if (typeof value === "boolean") return { boolValue: value };
	if (typeof value === "number") {
		return Number.isInteger(value)
			? { intValue: value }
			: { doubleValue: value };
	}

	return { stringValue: safeStringify(value) };
}

function safeStringify(value: unknown): string {
	try {
		return JSON.stringify(value);
	} catch {
		return "[Unserializable]";
	}
}

export class OTLPLogExporter {
	readonly url: string;
	private readonly batchSize: number;
	private readonly flushIntervalMs: number;
	private readonly timeoutMs: number;
	private readonly headers: Record<string, string>;
	private readonly resourceAttributes: Record<string, string>;

	private readonly queue: Record<string, unknown>[] = [];
	private flushTimer?: NodeJS.Timeout;
	private flushing = false;

	constructor(options: OTLPExporterOptions) {
		this.url = options.url;
		this.batchSize = options.batchSize ?? 50;
		this.flushIntervalMs = options.flushIntervalMs ?? 2000;
		this.timeoutMs = options.timeoutMs ?? 5000;
		this.headers = options.headers ?? {};
		this.resourceAttributes = options.resourceAttributes ?? {};

		this.startFlushTimer();
	}

	export(log: Record<string, unknown>) {
		this.queue.push(log);

		if (this.queue.length >= this.batchSize) {
			this.flush();
		}
	}

	private startFlushTimer() {
		this.flushTimer = setInterval(() => {
			this.flush();
		}, this.flushIntervalMs);

		this.flushTimer.unref?.();
	}

	private buildPayload(batch: Record<string, unknown>[]) {
		const logRecords: OTLPLogRecord[] = batch.map((log) => ({
			timeUnixNano: String(Date.now() * 1_000_000),
			severityText: String(log.level ?? "INFO").toUpperCase(),
			body: { stringValue: String(log.message ?? "") },
			attributes: Object.entries(log)
				.filter(([, value]) => value !== undefined)
				.map(([key, value]) => ({
					key,
					value: toOTLPValue(value),
				})),
		}));

		return JSON.stringify({
			resourceLogs: [
				{
					resource: {
						attributes: Object.entries(this.resourceAttributes).map(
							([key, value]) => ({
								key,
								value: { stringValue: value },
							})
						),
					},
					scopeLogs: [
						{
							scope: {
								name: "app-logger",
							},
							logRecords,
						},
					],
				},
			],
		});
	}

	async flush(): Promise<void> {
		if (this.flushing || this.queue.length === 0) return;

		this.flushing = true;
		const batch = this.queue.splice(0, this.batchSize);

		try {
			const parsed = new URL(this.url);
			const payload = this.buildPayload(batch);

			const isHttps = parsed.protocol === "https:";
			const transport = isHttps ? httpsRequest : request;

			await new Promise<void>((resolve) => {
				const req = transport(
					{
						hostname: parsed.hostname,
						port: parsed.port || (isHttps ? 443 : 80),
						path: parsed.pathname + parsed.search,
						method: "POST",
						timeout: this.timeoutMs,
						headers: {
							"Content-Type": "application/json",
							"Content-Length": Buffer.byteLength(payload),
							...this.headers,
						},
					},
					(res) => {
						res.resume();
						resolve();
					}
				);

				req.on("timeout", () => {
					req.destroy();
					resolve();
				});

				req.on("error", () => {
					resolve();
				});

				req.write(payload);
				req.end();
			});
		} catch {
			// swallow exporter failures
		} finally {
			this.flushing = false;
		}
	}

	async shutdown(): Promise<void> {
		if (this.flushTimer) {
			clearInterval(this.flushTimer);
		}

		await this.flush();
	}
}

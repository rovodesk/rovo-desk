import { Inject, Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { ConnectionName, type DataSource } from "@zero-heads-lab/database";
import { ISecrets } from "@zero-heads-lab/secrets/adapter";

import type { HealthResponse, HealthStatus } from "./types";

@Injectable()
export class HealthService {
	constructor(
		@InjectDataSource(ConnectionName.AUTH)
		private readonly db: DataSource,

		@Inject(ISecrets)
		private readonly secrets: ISecrets
	) {}

	private resolveOverallStatus(statuses: HealthStatus[]): HealthStatus {
		if (statuses.includes("down")) return "down";
		if (statuses.includes("degraded")) return "degraded";
		return "ok";
	}

	async checkDatabase() {
		const started = Date.now();

		try {
			await this.db.query("SELECT 1");

			return {
				status: "ok" as const,
				latencyMs: Date.now() - started,
			};
		} catch (error) {
			return {
				status: "down" as const,
				latencyMs: Date.now() - started,
				error:
					error instanceof Error ? error.message : "Unknown database error",
			};
		}
	}

	checkObservability() {
		try {
			const hasCollector = !!this.secrets.OTLP_COLLECTOR_URL;

			return {
				status: hasCollector ? ("ok" as const) : ("degraded" as const),
				error: hasCollector ? undefined : "OTLP collector URL not configured",
			};
		} catch (error) {
			return {
				status: "down" as const,
				error:
					error instanceof Error
						? error.message
						: "Unknown observability configuration error",
			};
		}
	}

	async getHealth(): Promise<HealthResponse> {
		// TODO - add more checks (e.g., cache, external APIs)
		const [database] = await Promise.all([this.checkDatabase()]);

		const observability = this.checkObservability();

		const status = this.resolveOverallStatus([
			database.status,
			observability.status,
		]);

		return {
			status,
			service: "rovodesk-api",
			version: process.env.APP_VERSION ?? "1.0.0",
			environment: this.secrets.ENV,
			timestamp: new Date().toISOString(),
			uptimeSeconds: Math.floor(process.uptime()),
			dependencies: {
				database,
				observability,
			},
		};
	}

	async isReady(): Promise<boolean> {
		const [database] = await Promise.all([this.checkDatabase()]);
		return database.status === "ok";
	}
}

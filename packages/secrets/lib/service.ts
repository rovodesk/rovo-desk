import { ISecrets } from "./adapter.js";
import {
	AuthServiceEnvironment,
	BillingServiceEnvironment,
	type Environment,
	type LogLevelWithSilent,
} from "./types.js";

type EnvSource = Record<string, string | undefined>;

export class SecretStore extends ISecrets {
	private readonly env: EnvSource;

	constructor(env: EnvSource = process.env) {
		super();
		this.env = env;
	}

	private getOptional(key: string): string | undefined {
		return this.env[key];
	}

	private getRequired(key: string): string {
		const value = this.getOptional(key);

		if (!value || value.trim() === "") {
			throw new Error(`Missing required environment variable: ${key}`);
		}

		return value;
	}

	private getRequiredNumber(key: string): number {
		const value = this.getRequired(key);
		const parsed = Number(value);

		if (!Number.isFinite(parsed)) {
			throw new Error(`Environment variable ${key} must be a valid number`);
		}

		return parsed;
	}

	private getOptionalEnum<T extends string>(
		key: string,
		allowed: readonly T[],
		fallback?: T
	): T {
		const value = this.getOptional(key);

		if (!value || value.trim() === "") {
			if (fallback !== undefined) return fallback;
			throw new Error(`Missing required environment variable: ${key}`);
		}

		if (!allowed.includes(value as T)) {
			throw new Error(
				`Environment variable ${key} must be one of: ${allowed.join(", ")}`
			);
		}

		return value as T;
	}

	get ENV(): Environment {
		return this.getOptionalEnum(
			"ENV",
			["development", "staging", "production"] as const,
			"development"
		);
	}

	get REDIS_URL(): string {
		return this.getRequired("REDIS_URL");
	}

	get OTLP_COLLECTOR_URL(): string {
		return this.getRequired("OTLP_COLLECTOR_URL");
	}

	get LOG_LEVEL(): LogLevelWithSilent {
		return this.getOptionalEnum(
			"LOG_LEVEL",
			["fatal", "error", "warn", "info", "debug", "trace", "silent"] as const,
			"error"
		);
	}

	get DATABASE_URL(): string {
		return this.getRequired("DATABASE_URL");
	}

	get billingService() {
		return {
			port: this.getRequiredNumber(BillingServiceEnvironment.PORT),
			url: this.getRequired(BillingServiceEnvironment.URL),
		};
	}

	get authService() {
		return {
			port: this.getRequiredNumber(AuthServiceEnvironment.PORT),
			jwtToken: this.getRequired(AuthServiceEnvironment.JWT_SECRET),
			url: this.getRequired(AuthServiceEnvironment.URL),
		};
	}
}

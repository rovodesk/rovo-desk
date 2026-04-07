export abstract class ISecrets {
	abstract get ENV(): "development" | "staging" | "production";
	abstract get REDIS_URL(): string;
	abstract get OTLP_COLLECTOR_URL(): string;
	abstract get LOG_LEVEL(): string;
	abstract get DATABASE_URL(): string;

	abstract get billingService(): {
		port: number;
		url: string;
	};

	abstract get authService(): {
		port: number;
		jwtToken: string;
		url: string;
	};
}

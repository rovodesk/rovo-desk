export type HealthStatus = "ok" | "degraded" | "down";

export type DependencyHealth = {
	status: HealthStatus;
	latencyMs?: number;
	error?: string;
};

export type HealthResponse = {
	status: HealthStatus;
	service: string;
	version: string;
	environment: string;
	timestamp: string;
	uptimeSeconds: number;
	dependencies: {
		database: DependencyHealth;
		// redis: DependencyHealth;
		observability: DependencyHealth;
	};
};

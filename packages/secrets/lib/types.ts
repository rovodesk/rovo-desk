export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";
export type LogLevelWithSilent = LogLevel | "silent";
export type Environment = "development" | "staging" | "production";

export enum BillingServiceEnvironment {
	PORT = "BILLING_SERVICE_PORT",
	URL = "BILLING_SERVICE_URL",
}

export enum AuthServiceEnvironment {
	PORT = "AUTH_SERVICE_PORT",
	JWT_SECRET = "JWT_SECRET",
	URL = "AUTH_SERVICE_URL",
}

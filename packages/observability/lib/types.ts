export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export type LogContext = {
	traceId?: string;
	spanId?: string;
	requestId?: string;

	userId?: string;
	workspaceId?: string;
	roleId?: string;

	context?: string;

	[key: string]: unknown;
};

export type LogPayload = {
	message: string;
	[key: string]: unknown;
};

export type TracerOptions = {
	app: string;
	version: string;
};

export type LoggerOptions = {
	app: string;
	level?: LogLevel;
	otlpUrl?: string;
	version?: string;
	redactKeys?: string[];
};

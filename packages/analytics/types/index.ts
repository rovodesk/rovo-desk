export type Event = {
	name: string;
	properties?: Record<string, unknown>;
};

export type LogLevel = "debug" | "info" | "warn" | "error";

import type { ErrorModel } from "./error.js";

export type ApiExceptionOptions = {
	statusCode?: number;
	code?: string | number;
	context?: string;
	traceId?: string;
	config?: unknown;
	user?: string;
};

export class ApiException extends Error {
	readonly statusCode: number;
	readonly code?: string | number;
	readonly context?: string;
	readonly traceId: string;
	readonly config?: unknown;
	readonly user?: string;

	constructor(message: string | object, options: ApiExceptionOptions = {}) {
		const normalizedMessage =
			typeof message === "string" ? message : JSON.stringify(message);

		super(normalizedMessage);

		this.name = "ApiException";

		this.statusCode = options.statusCode ?? 500;
		this.code = options.code;
		this.context = options.context;
		this.traceId =
			options.traceId ??
			globalThis.crypto?.randomUUID?.() ??
			Math.random().toString(36).substring(2);
		this.config = options.config;
		this.user = options.user;

		// Fix prototype chain (important for instanceof)
		Object.setPrototypeOf(this, new.target.prototype);
	}

	toJSON(): ErrorModel {
		return {
			error: {
				code: this.code ?? this.statusCode,
				traceId: this.traceId,
				message: this.message,
				timestamp: new Date().toISOString(),
				context: this.context,
			},
		};
	}
}

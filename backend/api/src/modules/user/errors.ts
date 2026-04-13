export class ServerError extends Error {
	readonly statusCode: number;
	readonly code?: string;
	readonly expose: boolean;

	constructor(
		message: string,
		options?: {
			statusCode?: number;
			code?: string;
			expose?: boolean;
			cause?: unknown;
		}
	) {
		super(message);

		this.name = this.constructor.name;
		this.statusCode = options?.statusCode ?? 500;
		this.code = options?.code;
		this.expose = options?.expose ?? this.statusCode < 500;

		if (options?.cause) {
			(this as Error & { cause?: unknown }).cause = options.cause;
		}
	}
}

export class UserServiceError extends ServerError {
	readonly status?: number;

	constructor(message: string, status?: number) {
		super(message);
		this.name = "UserServiceError";
		this.status = status;
	}
}

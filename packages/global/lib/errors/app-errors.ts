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

export class AuthenticationError extends Error {
	readonly statusCode: 401;

	constructor(message: string, statusCode: 401 = 401) {
		super(message);
		this.name = "AuthenticationError";
		this.statusCode = statusCode;
	}
}

export class ValidationError extends Error {
	readonly statusCode: 400 | 415 | 422;

	constructor(message: string, statusCode: 400 | 415 | 422 = 400) {
		super(message);
		this.name = "ValidationError";
		this.statusCode = statusCode;
	}
}

export class NotFoundError extends Error {
	readonly statusCode: 404;

	constructor(message: string) {
		super(message);
		this.name = "NotFoundError";
		this.statusCode = 404;
	}
}

export class ForbiddenError extends Error {
	readonly statusCode: 403;

	constructor(message: string) {
		super(message);
		this.name = "ForbiddenError";
		this.statusCode = 403;
	}
}

export class PaymentRequiredError extends Error {
	readonly statusCode: 402;

	constructor(message: string) {
		super(message);
		this.name = "PaymentRequiredError";
		this.statusCode = 402;
	}
}

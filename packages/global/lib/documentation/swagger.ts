import type { ApiResponseOptions } from "@nestjs/swagger";
import { httpStatus } from "@zero-heads-lab/shared/static";
import type { ErrorModel } from "@zero-heads-lab/shared/utils";

type SwaggerError = {
	status: number;
	route: string;
	message?: string;
	description?: string;
};

type SwaggerText = {
	status: number;
	text: string;
	description?: string;
};

type SwaggerJSON = {
	status: number;
	json: unknown;
	description?: string;
};

export const Swagger = {
	defaultResponseError({
		status,
		route,
		message,
		description,
	}: SwaggerError): ApiResponseOptions {
		return {
			schema: {
				example: {
					error: {
						code: status,
						traceId: "<traceid>",
						message: message ?? httpStatus[status] ?? "Unknown Error",
						timestamp: "<timestamp>",
						path: route,
					},
				} as ErrorModel,
			},
			description,
			status,
		};
	},

	defaultResponseText({
		status,
		text,
		description,
	}: SwaggerText): ApiResponseOptions {
		return {
			content: {
				"text/plain": {
					schema: {
						example: text,
					},
				},
			},
			description,
			status,
		};
	},

	defaultResponseJSON({
		status,
		json,
		description,
	}: SwaggerJSON): ApiResponseOptions {
		return {
			content: {
				"application/json": {
					schema: {
						example: json,
					},
				},
			},
			description,
			status,
		};
	},

	defaultRequestJSON(json: unknown): ApiResponseOptions {
		return {
			schema: {
				example: json,
			},
		};
	},
};

import { createMiddleware } from "@tanstack/react-start";

export const loggingMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const start = Date.now();

		console.log(
			`[Request] ${request.method} ${decodeURIComponent(request.url)} - Started at ${new Date().toISOString()}`
		);

		try {
			const result = await next();

			const duration = Date.now() - start;
			console.log(
				`[Response] ${request.method} ${decodeURIComponent(request.url)} - Success (${duration}ms)`
			);

			return result;
		} catch (error) {
			const duration = Date.now() - start;
			console.error(
				`[Error] ${request.method} ${decodeURIComponent(request.url)} - Failed after ${duration}ms:`,
				error
			);
			throw error;
		}
	}
);

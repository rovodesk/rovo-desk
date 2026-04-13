import crypto from "node:crypto";
import { Inject, Injectable, type NestMiddleware, Scope } from "@nestjs/common";
import { ITracer } from "@zero-heads-lab/observability";
import type { NextFunction, Request, Response } from "express";

type RequestWithMeta = Request & {
	id?: string;
	user?: {
		id?: string;
		workspaceId?: string;
		roleId?: string;
	};
};

@Injectable({ scope: Scope.REQUEST })
export class TracerContextMiddleware implements NestMiddleware {
	constructor(@Inject(ITracer) private readonly tracer: ITracer) {}

	use(req: RequestWithMeta, res: Response, next: NextFunction) {
		const startedAt = process.hrtime.bigint();

		/**
		 * Extract or create trace context
		 */
		const extractedContext = this.tracer.extractContext(
			req.rawHeaders as unknown as Record<string, string>
		);

		const traceIdFromHeader =
			typeof req.headers.traceid === "string" ? req.headers.traceid : undefined;

		const requestId =
			typeof req.headers["x-request-id"] === "string"
				? req.headers["x-request-id"]
				: crypto.randomUUID();

		req.headers["x-request-id"] = requestId;
		req.id = requestId;

		/**
		 * Root HTTP span
		 */
		this.tracer.withSpan(
			"http.request",
			// biome-ignore lint/suspicious/useAwait: Middleware can be async if needed
			async (span, ctx) => {
				const path = req.originalUrl ?? req.url;

				/**
				 * Enrich span
				 */
				span.setAttributes({
					"http.method": req.method,
					"http.route": path,
					"http.user_agent": req.headers["user-agent"],
					"http.client_ip": req.ip,
					"user.id": req.user?.id,
					"workspace.id": req.user?.workspaceId,
					"role.id": req.user?.roleId,
					"request.id": requestId,
				});

				/**
				 * Inject trace context back into headers (for downstream calls)
				 */
				this.tracer.injectContext(req.headers as Record<string, string>, ctx);

				const done = (event: "finish" | "close" | "error", err?: unknown) => {
					const durationMs =
						Number(process.hrtime.bigint() - startedAt) / 1_000_000;

					span.setAttributes({
						"http.status_code": res.statusCode,
						"http.response_content_length": res.getHeader("content-length"),
						"http.duration_ms": Number(durationMs.toFixed(2)),
						"http.event": event,
					});

					if (err || res.statusCode >= 500) {
						this.tracer.recordError(span, err ?? new Error("Server error"));
					}

					span.end();
				};

				const onFinish = () => done("finish");
				const onClose = () => done("close");
				const onError = (err: unknown) => done("error", err);

				res.once("finish", onFinish);
				res.once("close", onClose);
				res.once("error", onError);

				next();
			},
			{
				"http.request_id": requestId,
				"trace.id": traceIdFromHeader,
			},
			extractedContext
		);
	}
}

import crypto from "node:crypto";
import { Inject, Injectable, type NestMiddleware, Scope } from "@nestjs/common";
import { ILogger, runWithContext } from "@zero-heads-lab/observability";
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
export class LoggerContextMiddleware implements NestMiddleware {
	constructor(@Inject(ILogger) private readonly logger: ILogger) {}

	use(req: RequestWithMeta, res: Response, next: NextFunction) {
		const startedAt = process.hrtime.bigint();

		const traceId =
			typeof req.headers.traceid === "string"
				? req.headers.traceid
				: crypto.randomUUID();

		const requestId =
			typeof req.headers["x-request-id"] === "string"
				? req.headers["x-request-id"]
				: crypto.randomUUID();

		req.headers.traceid = traceId;
		req.headers["x-request-id"] = requestId;
		req.id = requestId;

		const context = {
			requestId,
			traceId,
			userId: req.user?.id,
			workspaceId: req.user?.workspaceId,
			roleId: req.user?.roleId,
			method: req.method,
			path: req.originalUrl ?? req.url,
			context: "HTTP",
		};

		runWithContext(context, () => {
			this.logger.info("HTTP request started", {
				method: req.method,
				path: req.originalUrl ?? req.url,
				userAgent: req.headers["user-agent"],
				ip: req.ip,
			});

			const done = (event: "finish" | "close" | "error", err?: unknown) => {
				res.removeListener("finish", onFinish);
				res.removeListener("close", onClose);
				res.removeListener("error", onError);

				const durationMs =
					Number(process.hrtime.bigint() - startedAt) / 1_000_000;

				const payload = {
					method: req.method,
					path: req.originalUrl ?? req.url,
					statusCode: res.statusCode,
					durationMs: Number(durationMs.toFixed(2)),
					contentLength: res.getHeader("content-length"),
					userAgent: req.headers["user-agent"],
					ip: req.ip,
					event,
				};

				if (err) {
					this.logger.error("HTTP request failed", payload, err);
					return;
				}

				if (res.statusCode >= 500) {
					this.logger.error(
						"HTTP request completed with server error",
						payload
					);
				} else if (res.statusCode >= 400) {
					this.logger.warn("HTTP request completed with client error", payload);
				} else {
					this.logger.info("HTTP request completed", payload);
				}
			};

			const onFinish = () => done("finish");
			const onClose = () => done("close");
			const onError = (err: unknown) => done("error", err);

			res.once("finish", onFinish);
			res.once("close", onClose);
			res.once("error", onError);

			next();
		});
	}
}

import {
	type CallHandler,
	type ExecutionContext,
	Inject,
	Injectable,
	type NestInterceptor,
	Scope,
} from "@nestjs/common";
import {
	getContext,
	ILogger,
	runWithContext,
} from "@zero-heads-lab/observability";
import type { Request, Response } from "express";
import { catchError, defer, type Observable, tap, throwError } from "rxjs";

type AuthenticatedRequest = Request & {
	id?: string;
	user?: {
		id?: string;
		workspaceId?: string;
		roleId?: string;
	};
};

@Injectable({ scope: Scope.REQUEST })
export class HttpLoggerInterceptor implements NestInterceptor {
	constructor(@Inject(ILogger) private readonly logger: ILogger) {}

	intercept(
		executionContext: ExecutionContext,
		next: CallHandler
	): Observable<unknown> {
		if (executionContext.getType() !== "http") {
			return next.handle();
		}

		const startedAt = process.hrtime.bigint();

		const request = executionContext
			.switchToHttp()
			.getRequest<AuthenticatedRequest>();

		const response = executionContext.switchToHttp().getResponse<Response>();

		const controller = executionContext.getClass().name;
		const handler = executionContext.getHandler().name;
		const routeContext = `${controller}.${handler}`;

		const existingContext = getContext();

		const enrichedContext = {
			...existingContext,
			context: routeContext,
			controller,
			handler,
			userId: request.user?.id ?? existingContext.userId,
			workspaceId: request.user?.workspaceId ?? existingContext.workspaceId,
			roleId: request.user?.roleId ?? existingContext.roleId,
			method: request.method,
			path: request.originalUrl ?? request.url,
		};

		return defer(() =>
			runWithContext(enrichedContext, () => {
				this.logger.info("HTTP request started", {
					ip: request.ip,
					userAgent: request.headers["user-agent"],
				});

				return next.handle().pipe(
					tap(() => {
						const durationMs =
							Number(process.hrtime.bigint() - startedAt) / 1_000_000;

						const payload = {
							statusCode: response.statusCode,
							durationMs: Number(durationMs.toFixed(2)),
						};

						if (response.statusCode >= 500) {
							this.logger.error(
								"HTTP request completed with server error",
								payload
							);
						} else if (response.statusCode >= 400) {
							this.logger.warn(
								"HTTP request completed with client error",
								payload
							);
						} else {
							this.logger.info("HTTP request completed", payload);
						}
					}),
					catchError((error) => {
						const durationMs =
							Number(process.hrtime.bigint() - startedAt) / 1_000_000;

						this.logger.error(
							"HTTP request failed",
							{
								statusCode: response.statusCode || 500,
								durationMs: Number(durationMs.toFixed(2)),
							},
							error
						);

						return throwError(() => error);
					})
				);
			})
		);
	}
}

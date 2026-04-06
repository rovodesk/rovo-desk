import type { ILogger } from "./logger";
import type { ITracer } from "./tracer";

export interface AppContext {
	logger: ILogger;
	tracer: ITracer;
	requestId?: string;
	userId?: string;
}

export type CreateAppContextMeta = {
	requestId?: string;
	userId?: string;
	service?: string;
	operation?: string;
};

export function createAppContext(
	logger: ILogger,
	tracer: ITracer,
	meta?: CreateAppContextMeta
): AppContext {
	return {
		logger: logger.withContext({
			requestId: meta?.requestId,
			userId: meta?.userId,
			service: meta?.service,
			operation: meta?.operation,
		}),
		tracer,
		requestId: meta?.requestId,
		userId: meta?.userId,
	};
}

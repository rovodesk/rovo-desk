import type { ITracer } from "@zero-heads-lab/analytics/lib/tracer";
import type { Database } from "@zero-heads-lab/database";
import { WidgetMutationRepository } from "./widget.mutation";
import { WidgetQueryRepository } from "./widget.query";
import type {
	IWidgetMutationRepository,
	IWidgetQueryRepository,
	IWidgetRepository,
} from "./widget.types";

export class WidgetRepository implements IWidgetRepository {
	readonly query: IWidgetQueryRepository;
	readonly mutation: IWidgetMutationRepository;

	constructor(db: Database, tracer: ITracer) {
		this.query = new WidgetQueryRepository(db, tracer);
		this.mutation = new WidgetMutationRepository(db, tracer);
	}
}

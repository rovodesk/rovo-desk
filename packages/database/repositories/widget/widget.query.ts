import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { Database } from "@zero-heads-lab/database";
import { eq } from "drizzle-orm";
import { widget as widgetSchema } from "../../lib/schemas/widget.schema";
import type { IWidgetQueryRepository, Widget } from "./widget.types";

export class WidgetQueryRepository implements IWidgetQueryRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;

	constructor(db: Database, tracer: ITracer) {
		this.db = db;
		this.tracer = tracer;
	}

	async getWidgetByOrganizationId(params: {
		organizationId: string;
	}): Promise<Widget | null> {
		return await this.tracer.withSpan(
			"widget.query.getWidgetByOrganizationId",
			async (span) => {
				span.setAttribute("widget.organization_id", params.organizationId);

				const widget = await this.db.query.widget.findFirst({
					where: eq(widgetSchema.organizationId, params.organizationId),
				});

				return widget ?? null;
			},
			{
				"db.operation": "select",
				"db.table": "widget",
			}
		);
	}
}

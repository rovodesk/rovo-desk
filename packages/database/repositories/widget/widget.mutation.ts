import type { ITracer } from "@zero-heads-lab/analytics/types";
import type { Database } from "@zero-heads-lab/database";
import type { WidgetConfig } from "@zero-heads-lab/shared/lib/types";
import { eq } from "drizzle-orm";
import { widget } from "../../lib/schemas/widget.schema";
import type { IWidgetMutationRepository } from "./widget.types";

export class WidgetMutationRepository implements IWidgetMutationRepository {
	private readonly db: Database;
	private readonly tracer: ITracer;

	constructor(db: Database, tracer: ITracer) {
		this.db = db;
		this.tracer = tracer;
	}

	async createWidget(params: {
		organizationId: string;
		config?: WidgetConfig;
	}) {
		return await this.tracer.withSpan(
			"widget.mutation.createWidget",
			async (span) => {
				span.setAttribute("widget.organization_id", params.organizationId);

				await this.db
					.insert(widget)
					.values({
						organizationId: params.organizationId,
						config: params.config,
					})
					.onConflictDoUpdate({
						target: [widget.organizationId],
						set: {
							config: params.config,
						},
					});
			},
			{
				"db.operation": "insert",
				"db.table": "widget",
			}
		);
	}

	async updateWidgetConfig(params: {
		organizationId: string;
		config: Partial<WidgetConfig>;
	}): Promise<void> {
		return await this.tracer.withSpan(
			"widget.mutation.updateWidgetConfig",
			async (span) => {
				span.setAttribute("widget.organization_id", params.organizationId);

				const existing = await this.db
					.select()
					.from(widget)
					.where(eq(widget.organizationId, params.organizationId))
					.limit(1)
					.then((res) => res[0]);
				if (!existing?.config) {
					throw new Error("Widget not found");
				}

				const mergedConfig: WidgetConfig = {
					...existing.config,
					...params.config,
					theme: {
						...existing.config.theme,
						...params.config.theme,
					},
					launcher: {
						...existing.config.launcher,
						...params.config.launcher,
					},
					screens: {
						...existing.config.screens,
						...params.config.screens,
					},
					conversation: {
						...existing.config.conversation,
						...params.config.conversation,
					},
					behavior: {
						...existing.config.behavior,
						...params.config.behavior,
					},
					advanced: {
						...existing.config.advanced,
						...params.config.advanced,
					},
				};

				await this.db
					.update(widget)
					.set({
						config: mergedConfig,
						version: existing.version++,
						updatedAt: new Date(),
					})
					.where(eq(widget.organizationId, params.organizationId));
			},
			{
				"db.operation": "update",
				"db.table": "widget",
			}
		);
	}
}

import { implement, ORPCError } from "@orpc/server";
import { WidgetAdminContract } from "@zero-heads-lab/contract/orpc/widget.contract";
import { WidgetRepository } from "@zero-heads-lab/database/repositories/widget";
import { AuthGuard } from "@/lib/guards/auth.guard";
import { BaseGuard } from "@/lib/guards/base.guard";
import { OrganizationGuard } from "@/lib/guards/organization.guard";

const os = implement(WidgetAdminContract);

export const updateSettings = os.updateSettings
	.use(BaseGuard)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.handler(async ({ context, input }) => {
		const database = context.database;
		const repo = new WidgetRepository(database, context.tracer!);

		try {
			await repo.mutation.updateWidgetConfig({
				organizationId: context.organizationId,
				config: input.widgetConfig,
			});
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "Failed to update widget settings",
			});
		}
	})
	.callable();

export const getWidget = os.getWidget
	.use(BaseGuard)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.handler(async ({ context }) => {
		const database = context.database;
		const repo = new WidgetRepository(database, context.tracer!);
		const widget = await repo.query.getWidgetByOrganizationId({
			organizationId: context.organizationId,
		});

		if (!widget) {
			throw new ORPCError("NOT_FOUND", {
				message: "Widget not found",
			});
		}

		return widget;
	})
	.callable();

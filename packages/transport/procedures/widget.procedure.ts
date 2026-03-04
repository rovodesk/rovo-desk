import { ORPCError } from "@orpc/client";
import { updateWidgetConfig } from "@zero-heads-lab/database/repositories/widget/mutations";
import { getWidgetByOrganizationId } from "@zero-heads-lab/database/repositories/widget/queries";
import { base } from "../context";
import { UPDATE_WIDGET_CONFIG_INPUT_DTO, WIDGET_DTO } from "../dto/widget.dto";
import { AuthGuard } from "../middlewares/auth.middleware";
import { BaseMiddleware } from "../middlewares/base.middleware";
import { OrganizationGuard } from "../middlewares/organization.middleware";

export const updateWidgetSettings = base
	.input(UPDATE_WIDGET_CONFIG_INPUT_DTO)
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.handler(async ({ context, input }) => {
		const database = context.database;
		try {
			await updateWidgetConfig(database, {
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

export const getWidget = base
	.use(BaseMiddleware)
	.use(AuthGuard)
	.use(OrganizationGuard)
	.output(WIDGET_DTO)
	.handler(async ({ context }) => {
		const database = context.database;
		const widget = await getWidgetByOrganizationId(database, {
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

import type { WidgetConfig } from "@zero-heads-lab/shared/types";
import type { InferSelectModel } from "drizzle-orm";
import type { widget as widgetSchema } from "../../lib/schemas/widget.schema";

export type Widget = InferSelectModel<typeof widgetSchema>;

export interface IWidgetMutationRepository {
	createWidget(params: {
		organizationId: string;
		config?: WidgetConfig;
	}): Promise<void>;
	updateWidgetConfig(params: {
		organizationId: string;
		config: Partial<WidgetConfig>;
	}): Promise<void>;
}

export interface IWidgetQueryRepository {
	getWidgetByOrganizationId(params: {
		organizationId: string;
	}): Promise<Widget | null>;
}

export interface IWidgetRepository {
	query: IWidgetQueryRepository;
	mutation: IWidgetMutationRepository;
}

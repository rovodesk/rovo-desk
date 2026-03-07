import type { WidgetConfig } from "@zero-heads-lab/shared/types";
import type { Database } from "conn";
import { eq } from "drizzle-orm";
import { widget } from "../../drizzle/schemas/widget.schema";

export async function createWidget(
	database: Database,
	params: {
		organizationId: string;
		config?: WidgetConfig;
	}
) {
	return await database
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
		})
		.catch((error) => {
			console.error(error);
			throw new Error("Failed to create widget");
		});
}

export async function updateWidgetConfig(
	database: Database,
	params: {
		organizationId: string;
		config: Partial<WidgetConfig>;
	}
) {
	const existing = await database
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

	return await database
		.update(widget)
		.set({
			config: mergedConfig,
			version: existing.version++,
			updatedAt: new Date(),
		})
		.where(eq(widget.organizationId, params.organizationId))
		.catch((error) => {
			console.error(error);
			throw new Error("Failed to update widget config");
		});
}

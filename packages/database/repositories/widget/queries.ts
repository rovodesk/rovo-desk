import type { Database } from "conn";
import { eq } from "drizzle-orm";
import { widget } from "../../drizzle/schemas/widget.schema";

export async function getWidgetByOrganizationId(
	database: Database,
	params: { organizationId: string }
) {
	return await database.query.widget.findFirst({
		where: eq(widget.organizationId, params.organizationId),
		columns: {
			organizationId: false,
			config: true,
			version: true,
			createdAt: true,
			updatedAt: true,
		},
	});
}

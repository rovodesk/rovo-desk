import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { IntegrationSettings } from "@/features/settings/integrations";

const integrationsSearchSchema = z.object({
	filter: z.string().optional(),
	type: z.enum(["all", "connected", "notConnected"]).optional(),
	sort: z.enum(["asc", "desc"]).optional(),
});

export const Route = createFileRoute("/_authenticated/settings/integrations")({
	component: IntegrationSettings,
	validateSearch: integrationsSearchSchema,
});

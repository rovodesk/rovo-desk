import { createFileRoute } from "@tanstack/react-router";
import { AppSettings } from "@/features/settings/apps";

export const Route = createFileRoute("/_authenticated/settings/apps/")({
	component: AppSettings,
});

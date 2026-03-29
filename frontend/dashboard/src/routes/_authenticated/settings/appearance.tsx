import { createFileRoute } from "@tanstack/react-router";
import { AppearenceSettings } from "@/features/settings/appearence";

export const Route = createFileRoute("/_authenticated/settings/appearance")({
	component: AppearenceSettings,
});

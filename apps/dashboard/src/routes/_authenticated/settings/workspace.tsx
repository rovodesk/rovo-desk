import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceSettings } from "@/features/settings/workspace";

export const Route = createFileRoute("/_authenticated/settings/workspace")({
	component: WorkspaceSettings,
});

import { createFileRoute } from "@tanstack/react-router";
import { NotificationSettings } from "@/features/settings/notifications";

export const Route = createFileRoute("/_authenticated/settings/notifications")({
	component: NotificationSettings,
});

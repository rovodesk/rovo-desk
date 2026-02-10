import { createFileRoute } from "@tanstack/react-router";
import { ConversationsHome } from "@/features/conversations";

export const Route = createFileRoute("/_authenticated/conversations")({
	component: ConversationsHome,
});

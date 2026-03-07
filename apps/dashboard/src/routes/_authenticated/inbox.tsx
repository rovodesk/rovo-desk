// import { createFileRoute } from "@tanstack/react-router";
// import { ConversationsHome } from "@/features/conversations";

// export const Route = createFileRoute("/_authenticated/conversations")({
// 	component: ConversationsHome,
// });

import { createFileRoute } from "@tanstack/react-router";
import ConversationsPage from "@/features/inbox";

export const Route = createFileRoute("/_authenticated/inbox")({
	component: ConversationsPage,
});

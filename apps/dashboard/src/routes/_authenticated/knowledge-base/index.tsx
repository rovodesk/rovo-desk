import { createFileRoute } from "@tanstack/react-router";
import { KnowledgeBaseHome } from "@/features/knowledge-base";

export const Route = createFileRoute("/_authenticated/knowledge-base/")({
	component: KnowledgeBaseHome,
});

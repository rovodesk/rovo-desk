import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { KnowledgeBaseHome } from "@/features/help-center";

export const Route = createFileRoute("/_authenticated/help-center/")({
	component: KnowledgeBaseHome,
	validateSearch: z.object({
		filter: z.string().optional(),
		tabs: z.enum(["all", "shared", "favorites"]).default("all"),
		view: z.enum(["list", "card"]).default("card"),
		sort: z.enum(["asc", "desc"]).default("desc"),
	}),
});

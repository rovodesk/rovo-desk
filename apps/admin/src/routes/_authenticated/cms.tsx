import { createFileRoute } from "@tanstack/react-router";
import CMS from "@/features/cms";

export const Route = createFileRoute("/_authenticated/cms")({
	component: CMS,
});

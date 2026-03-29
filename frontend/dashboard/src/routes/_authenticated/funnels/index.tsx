import { createFileRoute } from "@tanstack/react-router";
import ContactsPage from "@/features/funnel/contacts";

export const Route = createFileRoute("/_authenticated/funnels/")({
	component: ContactsPage,
});

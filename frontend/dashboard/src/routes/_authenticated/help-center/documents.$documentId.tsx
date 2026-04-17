import { createFileRoute } from "@tanstack/react-router";
import { Document } from "@/features/help-center/document";

export const Route = createFileRoute(
	"/_authenticated/help-center/documents/$documentId"
)({
	loader: ({ params }) => {
		return { documentId: params.documentId };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { documentId } = Route.useParams();
	return <Document id={documentId} />;
}

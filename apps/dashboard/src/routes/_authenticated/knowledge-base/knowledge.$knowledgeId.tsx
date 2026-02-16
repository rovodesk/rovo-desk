import { createFileRoute } from "@tanstack/react-router";
import { Document } from "@/features/knowledge-base/document";

export const Route = createFileRoute(
	"/_authenticated/knowledge-base/knowledge/$knowledgeId"
)({
	loader: ({ params }) => {
		// Fetch Knowledge from Database
		console.log(params);
		return { knowledgeId: params.knowledgeId };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { knowledgeId } = Route.useParams();
	return <Document id={knowledgeId} />;
}

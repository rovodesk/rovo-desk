import { createFileRoute } from "@tanstack/react-router";
import { OrganizationDetails } from "@/features/user-management/components/organization-details";

export const Route = createFileRoute(
	"/_authenticated/user-management/details/$organizationId"
)({
	loader: ({ params }) => {
		return { organizationId: params.organizationId };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { organizationId } = Route.useParams();
	return <OrganizationDetails id={organizationId} />;
}

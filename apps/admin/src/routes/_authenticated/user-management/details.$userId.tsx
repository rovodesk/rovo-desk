import { createFileRoute } from "@tanstack/react-router";
import { UserDetails } from "@/features/user-management/components/user-details";

export const Route = createFileRoute(
	"/_authenticated/user-management/details/$userId"
)({
	loader: ({ params }) => {
		return { userId: params.userId };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { userId } = Route.useParams();
	return <UserDetails id={userId} />;
}

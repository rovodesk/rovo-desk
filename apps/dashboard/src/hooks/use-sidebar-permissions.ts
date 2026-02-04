import type { AuthRole } from "@zero-heads-lab/auth/access-control";
import { useAuthorization } from "@zero-heads-lab/auth/hooks";

export function useSidebarPermissions(role: AuthRole) {
	const orgRead = useAuthorization({
		role,
		resource: "organization",
		action: "read",
	});

	const orgWrite = useAuthorization({
		role,
		resource: "organization",
		action: "update",
	});

	return {
		isLoading: orgRead.isLoading || orgWrite.isLoading,
		permissions: {
			"organization:read": orgRead.can,
			"organization:update": orgWrite.can,
		},
	};
}

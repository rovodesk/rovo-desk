import type { AuthRole, Resource } from "@zero-heads-lab/auth/access-control";
import { useAuthorization } from "@zero-heads-lab/auth/hooks";
import type {
	PermissionAction,
	PermissionCheckMap,
} from "@zero-heads-lab/auth/types";
import { useMemo } from "react";
import type { SidebarConfig } from "@/types/sidebar";

/**
 * Custom hook to fetch user permissions based on a sidebar configuration.
 * It automatically extracts all resource/action pairs from the config's visibility rules
 * and performs a bulk check.
 */
export function useUserPermissions(role: AuthRole, config: SidebarConfig) {
	const permissionsToCheck = useMemo(() => {
		const map: PermissionCheckMap = {};

		// Helper to recursively extract permissions from nav items
		const processItem = (item: {
			visibility?: { resource?: Resource; actions?: PermissionAction[] };
			items?: unknown[];
		}) => {
			if (item.visibility?.resource && item.visibility?.actions) {
				const res = item.visibility.resource;
				const actions = item.visibility.actions;

				map[res] = [
					...new Set([...(map[res] || []), ...actions]),
				] as PermissionAction[];
			}

			// Process nested items for collapsibles
			if (item.items && Array.isArray(item.items)) {
				for (const child of item.items) {
					// biome-ignore lint/suspicious/noExplicitAny: I just dont know AI Knows
					processItem(child as any);
				}
			}
		};

		// 1. Scan Nav Groups
		for (const group of config.navGroups) {
			for (const item of group.items) {
				processItem(item);
			}
		}

		// 2. Scan Quick Links
		if (config.quickLinks) {
			config.quickLinks.primary?.forEach(processItem);
			config.quickLinks.secondary?.forEach(processItem);
		}

		// 3. Scan Footer
		config.footer.forEach(processItem);

		return map;
	}, [config]);

	const { permissions, isLoading, error } = useAuthorization({
		role,
		permissions: permissionsToCheck,
	});

	return {
		isLoading,
		permissions,
		error,
	};
}

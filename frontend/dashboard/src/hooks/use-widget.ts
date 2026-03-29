import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@zero-heads-lab/auth/hooks";
import type {
	UPDATE_WIDGET_CONFIG_INPUT_DTO,
	WIDGET_DTO,
} from "@zero-heads-lab/contract/dto/widget.dto";
import type { z } from "zod";
import { orpcQuery } from "@/lib/orpc-client";

type WidgetData = z.infer<typeof WIDGET_DTO>;
type UpdateWidgetSettingsInput = z.infer<typeof UPDATE_WIDGET_CONFIG_INPUT_DTO>;

export function useWidget() {
	const { session, loading: isSessionLoading } = useSession();
	const queryClient = useQueryClient();

	const organizationId = session?.session.activeOrganizationId;

	/* ===================================================== */
	/* ===================== QUERY KEYS ==================== */
	/* ===================================================== */

	const keys = {
		widget: ["widget", organizationId],
	};

	const enabled = Boolean(organizationId) && !isSessionLoading;

	const widgetQuery = useQuery<WidgetData>({
		...orpcQuery.widget.get.queryOptions({
			enabled,
			queryKey: keys.widget,
		}),
	});

	/* ---------- UPDATE SETTINGS ---------- */

	const updateSettings = useMutation<void, Error, UpdateWidgetSettingsInput>({
		mutationFn: (input) => orpcQuery.widget.updateSettings.call(input),

		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey: keys.widget });

			const previous = queryClient.getQueryData<WidgetData>(keys.widget);

			queryClient.setQueryData<WidgetData>(keys.widget, (old) =>
				old ? { ...old, ...input } : old
			);

			return { previous };
		},

		onError: (_err, _input, ctx) => {
			if (ctx?.previous) queryClient.setQueryData(keys.widget, ctx.previous);
		},

		onSettled: () => queryClient.invalidateQueries({ queryKey: keys.widget }),
	});

	return {
		widgetQuery,
		updateSettings,
	};
}

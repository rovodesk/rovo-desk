import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useOrganization } from "@zero-heads-lab/auth/hooks/use-organization";
import type {
	UPDATE_WIDGET_CONFIG_INPUT_DTO,
	WIDGET_DTO,
} from "@zero-heads-lab/contract/dto/widget.dto";
import type { z } from "zod";
import { orpcQuery } from "@/lib/orpc-client";

type WidgetData = z.infer<typeof WIDGET_DTO>;
type UpdateWidgetSettingsInput = z.infer<typeof UPDATE_WIDGET_CONFIG_INPUT_DTO>;
type UpdateWidgetSettingsContext = {
	previous?: WidgetData;
};

export function useWidget() {
	const { data: workspace } = useOrganization();
	const queryClient = useQueryClient();

	const organizationId = workspace?.currentOrganization;
	/* ===================================================== */
	/* ===================== QUERY KEYS ==================== */
	/* ===================================================== */

	const keys = {
		widget: ["widget", organizationId],
	};

	const widgetQuery = useQuery<WidgetData>({
		...orpcQuery.widget.get.queryOptions({
			queryKey: keys.widget,
		}),
		enabled: !!organizationId,
	});

	/* ---------- UPDATE SETTINGS ---------- */

	const updateSettings = useMutation<
		void,
		Error,
		UpdateWidgetSettingsInput,
		UpdateWidgetSettingsContext
	>({
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

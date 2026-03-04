/** biome-ignore-all lint/suspicious/noExplicitAny: connection type is not properly typed */
import {
	type UseQueryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "@zero-heads-lab/auth/hooks";
import { orpcQuery } from "@zero-heads-lab/transport/client";

/* ------------------------------------------------ */
/* -------------------- TYPES --------------------- */
/* ------------------------------------------------ */

type WidgetData = Awaited<ReturnType<typeof orpcQuery.widget.get.call>>;
type UpdateWidgetSettingsInput = Parameters<
	typeof orpcQuery.widget.updateSettings.call
>[0];

/* ------------------------------------------------ */
/* ---------------- MAIN HOOK --------------------- */
/* ------------------------------------------------ */

export function useWidget(
	widgetQueryOptions?: Omit<UseQueryOptions<WidgetData>, "queryKey" | "queryFn">
) {
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
		...widgetQueryOptions,
	});

	/* ---------- UPDATE SETTINGS ---------- */

	const updateSettings = useMutation<
		void,
		Error,
		UpdateWidgetSettingsInput,
		{ previous?: WidgetData }
	>({
		mutationFn: (input) => orpcQuery.widget.updateSettings.call(input),

		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey: keys.widget });

			const previous = queryClient.getQueryData<WidgetData>(keys.widget);

			queryClient.setQueryData<WidgetData>(keys.widget, (old: any) =>
				old ? { ...old, ...input } : old
			);

			return { previous };
		},

		onError: (_err, _input, ctx) => {
			if (ctx?.previous) queryClient.setQueryData(keys.widget, ctx.previous);
		},

		onSettled: () => queryClient.invalidateQueries({ queryKey: keys.widget }),
	});

	const loading =
		isSessionLoading || widgetQuery.isLoading || updateSettings.isPending;

	return {
		widget: widgetQuery.data,
		isLoading: loading,

		updateWidgetSettings: updateSettings.mutate,
		updateWidgetSettingsAsync: updateSettings.mutateAsync,
	};
}

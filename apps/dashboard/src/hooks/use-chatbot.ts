import {
	type UseQueryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "@zero-heads-lab/auth/hooks";
import { orpcQuery } from "@zero-heads-lab/transport/client";
import type { UPDATE_CHATBOT_SETTINGS_INPUT_DTO } from "@zero-heads-lab/transport/dto/chatbot.dto";
import type { z } from "zod";

/* ------------------------------------------------ */
/* -------------------- TYPES --------------------- */
/* ------------------------------------------------ */

// type ChatbotData = z.infer<typeof CHATBOT_WITH_SETTINGS_DTO>;
type ChatbotData = Awaited<ReturnType<typeof orpcQuery.chatbot.find.call>>;

type UpdateSettingsInput = z.infer<typeof UPDATE_CHATBOT_SETTINGS_INPUT_DTO>;

/* ------------------------------------------------ */
/* ---------------- MAIN HOOK --------------------- */
/* ------------------------------------------------ */

export function useChatbot(
	queryOptions?: Omit<UseQueryOptions<ChatbotData>, "queryKey" | "queryFn">
) {
	const { session, loading: isSessionLoading } = useSession();
	const queryClient = useQueryClient();

	const organizationId = session?.session.activeOrganizationId;

	/* ===================================================== */
	/* ======================= QUERY ======================= */
	/* ===================================================== */

	const baseQueryOptions = orpcQuery.chatbot.find.queryOptions({
		enabled: Boolean(organizationId) && !isSessionLoading,
	});

	const query = useQuery<ChatbotData>({
		...baseQueryOptions,
		...queryOptions,
	});

	/* ===================================================== */
	/* ===================== MUTATION ====================== */
	/* ===================================================== */

	const updateMutation = useMutation<ChatbotData, Error, UpdateSettingsInput>({
		mutationFn: async (input) => {
			return await orpcQuery.chatbot.updateSettings.call(input);
		},

		onSuccess: (updated) => {
			// Optimistically replace cache with fresh data
			queryClient.setQueryData(baseQueryOptions.queryKey, updated);
		},

		onError: (error) => {
			console.error("Failed to update chatbot settings:", error);
		},
	});

	/* ===================================================== */
	/* ================= MEMOIZED OUTPUT =================== */
	/* ===================================================== */

	const loading =
		query.isLoading || isSessionLoading || updateMutation.isPending;

	return {
		chatbot: query.data,
		loading,
		refetch: query.refetch,
		updateSettings: updateMutation.mutate,
		updateSettingsAsync: updateMutation.mutateAsync,
	};
}

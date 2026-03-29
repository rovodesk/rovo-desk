import {
	createORPCClient,
	type InferClientInputs,
	type InferClientOutputs,
	onError,
} from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { usePostHog } from "@zero-heads-lab/analytics/client/hooks";
import type { ClientRouterContract } from "@zero-heads-lab/contract/orpc";
import { toast } from "@zero-heads-lab/design-system/components/ui/toast";
import { AxiosError } from "axios";
import { env } from "@/env";

export const link = () => {
	const posthog = usePostHog();

	return new RPCLink({
		url: env.VITE_RPC_SERVER_URL,
		headers: () => ({
			authorization: "Bearer token",
		}),
		fetch: (request, init) => {
			return globalThis.fetch(request, {
				...init,
				credentials: "include", // Include cookies for cross-origin requests
			});
		},
		interceptors: [
			onError((error) => {
				if (error instanceof AxiosError) {
					toast.error("Something went wrong!");
					posthog.captureException(error, {
						properties: {
							rpc: true,
							status: error.response?.status,
							message: error.response?.data,
						},
					});
				}
			}),
		],
	});
};

export const RPCClient: ClientRouterContract = createORPCClient(link);

export const orpcQuery = createTanstackQueryUtils(RPCClient);

export type RPCInputs = Pick<
	InferClientInputs<typeof RPCClient>,
	"admin"
>["admin"];
export type RPCOutputs = Pick<
	InferClientOutputs<typeof RPCClient>,
	"admin"
>["admin"];

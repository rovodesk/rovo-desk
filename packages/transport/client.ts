import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { SimpleCsrfProtectionLinkPlugin } from "@orpc/client/plugins";
import type { ContractRouterClient } from "@orpc/contract";
import type { ORPCContext } from "context";
import { keys } from "./keys/client";
import type { routerContract } from "./router";

declare global {
	var $client: ContractRouterClient<typeof routerContract> | undefined;
}

const link = new RPCLink<ORPCContext>({
	url: keys.VITE_RPC_SERVER_URL,
	headers: () => ({
		// "x-api-key": "my-api-key",
	}),
	plugins: [new SimpleCsrfProtectionLinkPlugin()],
	fetch: (request, init) => {
		return globalThis.fetch(request, {
			...init,
			// Include cookies for cross-origin requests
			credentials: "include",
		});
	},
	interceptors: [
		onError((error) => {
			console.error("INTERCEPTOR ERROR", error);
		}),
	],
});

export const client: ContractRouterClient<typeof routerContract> =
	createORPCClient(link);

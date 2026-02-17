import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import {
	RequestHeadersPlugin,
	SimpleCsrfProtectionHandlerPlugin,
} from "@orpc/server/plugins";
import { RouterContract } from "../contract";

export const orpcHandler = new RPCHandler(RouterContract, {
	plugins: [
		new RequestHeadersPlugin(),
		new SimpleCsrfProtectionHandlerPlugin(),
	],
	interceptors: [
		onError((error) => {
			console.error("ORPC ERROR", error);
		}),
	],
});

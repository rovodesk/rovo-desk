import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { SimpleCsrfProtectionHandlerPlugin } from "@orpc/server/plugins";
import { AdminRouter } from "@/modules/admin/admin.router";
import { ProfileRouter } from "@/modules/profile/profile.router";
import { WidgetRouter } from "@/modules/widget/widget.router";

const router = {
	widget: WidgetRouter,
	profile: ProfileRouter,
	admin: AdminRouter,
};

export const orpcHandler = new RPCHandler(router, {
	plugins: [new SimpleCsrfProtectionHandlerPlugin()],
	interceptors: [
		onError((error) => {
			console.error("ORPC ERROR", error);
		}),
	],
});

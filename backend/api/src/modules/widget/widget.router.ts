import { implement } from "@orpc/server";
import { WidgetAdminContract } from "@zero-heads-lab/contract/orpc/widget.contract";
import { getWidget, updateSettings } from "./widget";

export const WidgetRouter = implement(WidgetAdminContract).router({
	updateSettings,
	getWidget,
});

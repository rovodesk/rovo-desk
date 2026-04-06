import { oc } from "@orpc/contract";
import { UPDATE_WIDGET_CONFIG_INPUT_DTO, WIDGET_DTO } from "dto/widget.dto";
import { z } from "zod";

export const updateSettings = oc
	.route({
		method: "PUT",
		path: "/widget/update",
	})
	.input(UPDATE_WIDGET_CONFIG_INPUT_DTO)
	.output(z.void({}));

export const get = oc
	.route({
		method: "GET",
		path: "/widget/get",
	})
	.output(WIDGET_DTO);

export const WidgetAdminContract = {
	updateSettings,
	get,
};

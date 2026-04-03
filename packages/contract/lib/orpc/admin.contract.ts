import { oc } from "@orpc/contract";
import {
	LIST_ORGANIZATIONS_INPUT_DTO,
	LIST_ORGANIZATIONS_OUTPUT_DTO,
} from "dto/admin.dto";

export const list = oc
	.route({
		method: "GET",
		path: "/admin/organizations",
	})
	.input(LIST_ORGANIZATIONS_INPUT_DTO)
	.output(LIST_ORGANIZATIONS_OUTPUT_DTO);

export const AdminContract = {
	organization: {
		list,
	},
};

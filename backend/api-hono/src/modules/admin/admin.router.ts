import { implement } from "@orpc/server";
import { AdminContract } from "@zero-heads-lab/contract/orpc/admin.contract";
import { list } from "./admin";

export const AdminRouter = implement(AdminContract).router({
	organization: {
		list,
	},
});

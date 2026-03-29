import type { ContractRouterClient } from "@orpc/contract";
import { AdminContract } from "./admin.contract";
import { HealthContract } from "./health.contract";
import { ProfileContract } from "./profile.contract";
import { WidgetAdminContract } from "./widget.contract";

export const RouterContract = {
	admin: AdminContract,
	health: HealthContract,
	profile: ProfileContract,
	widget: WidgetAdminContract,
};

export type ClientRouterContract = ContractRouterClient<typeof RouterContract>;

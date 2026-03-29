import { os } from "@orpc/server";
import type { ORPCContext } from "@zero-heads-lab/contract/orpc/context";
import type { Bindings, Variables } from "../../types";

export type AppEnv = {
	Bindings: Bindings;
	Variables: Variables;
};

export const RPCContext = os.$context<ORPCContext>();

export type BaseContext = ORPCContext & {
	headers: Headers;
	analytics: NonNullable<ORPCContext["analytics"]>;
	logger: NonNullable<ORPCContext["logger"]>;
	tracer: NonNullable<ORPCContext["tracer"]>;
	database: NonNullable<ORPCContext["database"]>;
};

export type AuthenticatedContext = BaseContext & {
	auth: NonNullable<ORPCContext["auth"]>;
	session: NonNullable<ORPCContext["session"]>;
	user: NonNullable<ORPCContext["user"]>;
	role: NonNullable<ORPCContext["role"]>;
};

export type OrganizationContext = AuthenticatedContext & {
	organizationId: string;
};

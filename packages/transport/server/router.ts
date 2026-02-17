import { implement } from "@orpc/server";
import { RouterContract } from "../contract";

export const os = implement(RouterContract);
export const router = os.router(RouterContract);

export type AppRouter = typeof router;

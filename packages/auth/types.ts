import type { createAuth } from "./server";

export type AuthInstance = Awaited<ReturnType<typeof createAuth>>;

export type AuthSession = AuthInstance["$Infer"]["Session"]["session"];
export type AuthUser = AuthInstance["$Infer"]["Session"]["user"];
export type Organization = AuthInstance["$Infer"]["Organization"];

export type NavigateFn = (href: string) => void;

export type ReplaceFn = (href: string) => void;

export type ToastFn = {
	success: (message: string) => void;
	error: (message: string) => void;
};

export type CheckAuthorizationParams = {
	role: string;
	permission: string;
	feature: string;
	plan: string;
};

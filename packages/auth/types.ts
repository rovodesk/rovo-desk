import type { authClient } from "./client";
import type { createAuth } from "./server";

export type AuthInstance = Awaited<ReturnType<typeof createAuth>>;

export type AuthClient = ReturnType<typeof authClient>;

export type Session = AuthInstance["$Infer"]["Session"];
export type AuthSession = Session["session"];
export type AuthUser = Session["user"];

export type Organization = {
	id: string;
	name: string;
	slug: string;
	__optimistic?: boolean;
};

export type NavigateFn = (href: string) => void;

export type ReplaceFn = (href: string) => void;

export type CheckAuthorizationParams = {
	role: string;
	permission: string;
	feature: string;
	plan: string;
};

export type MutationOptions = {
	onSuccess?: (...args: Record<string, unknown>[]) => void;
	onError?: (error: Error) => void;
};

export type OAuthProvider = "google" | "github";

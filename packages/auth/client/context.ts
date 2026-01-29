// @/lib/auth/context.ts
/** biome-ignore-all lint/suspicious/noExplicitAny: user session and organization types are not available */
import { createContext } from "react";
import type { Providers } from "../constants";
import type { NavigateFn, ReplaceFn, ToastFn } from "../types";

export interface AuthState {
	isLoaded: boolean;

	// Using Partial/Optional types to match TanStack Query's initial states
	user?: any;
	session?: any;
	activeOrganization?: any;

	// Organization management
	listOrganizations: any[] | null;
	createOrganization: (input: {
		name: string;
		slug: string;
	}) => Promise<void> | void;
	setActiveOrganization: (organizationId: string) => Promise<void> | void;

	// Actions
	signOut: () => Promise<void> | void;
	signInWithSocialProvider: (provider: Providers) => Promise<void> | void;

	// Config
	toast: ToastFn;
	navigate: NavigateFn;
	replace: ReplaceFn;
}

export const AuthContext = createContext<AuthState | null>(null);

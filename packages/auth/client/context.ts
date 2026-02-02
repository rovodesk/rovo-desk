<<<<<<< HEAD
=======
"use client";

import type {} from "better-auth/client";
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
import { createContext, useContext } from "react";
import type { AuthClient, ReplaceFn } from "../types";

export interface AuthState {
	replace: ReplaceFn;

	authClient: AuthClient;
}

export const AuthContext = createContext<AuthState | null>(null);

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
};

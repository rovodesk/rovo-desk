<<<<<<< HEAD
=======
"use client";

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
import { useMemo } from "react";
import type { AuthClient, ReplaceFn } from "../types";
import { authClient } from "./auth-client";
import { AuthContext } from "./context";

function defaultReplace(href: string) {
	window.location.replace(href);
}

type AuthProviderProps = {
	children: React.ReactNode;
<<<<<<< HEAD
	authClient?: AuthClient;
	replace?: ReplaceFn;
=======
	replace?: ReplaceFn;
	authClient?: AuthClient;
>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
};

function defaultAuthClient() {
	return authClient();
}

export const AuthProvider = ({
	children,
	replace,
	authClient: authClientProp,
}: AuthProviderProps) => {
	const replaceFn = useMemo(() => replace || defaultReplace, [replace]);

	const authClient = useMemo(
		() => authClientProp || defaultAuthClient(),
		[authClientProp]
	);

	const values = useMemo(
		() => ({
			replace: replaceFn,
			authClient,
		}),
		[replaceFn, authClient]
	);

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

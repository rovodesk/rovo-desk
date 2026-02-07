<<<<<<< HEAD
<<<<<<< HEAD



=======
"use client"

=======
>>>>>>> fe3fce5 (feat: Implement last login method display, update billing products, and refactor authentication hooks and schemas.)

import { useMemo } from "react";
import { authClient } from "./auth-client";

>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)

import { AuthContext } from "./context";

function defaultReplace(href: string) {
	window.location.replace(href);
}

type AuthProviderProps = {
	children: React.ReactNode;
<<<<<<< HEAD
	authClient: AuthClient
replace?: ReplaceFn;
}

export const AuthProvider = ({
	children,
	replace,
	authClient,
}: AuthProviderProps) => {
	const replaceFn = useMemo(() => replace || defaultReplace, [replace]);

	=======
	replace?: ReplaceFn
	authClient?: AuthClient;
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

	>>>>>>> 8137094 (feat: roles and basic permissions addded, optimzed and refactored)
	const values = useMemo(
		() => ({
			replace: replaceFn,
			authClient,
		}),
		[replaceFn, authClient]
	);

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

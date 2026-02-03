import { useMemo } from "react";
import type { AuthClient, ReplaceFn } from "../types";
import { authClient } from "./auth-client";
import { AuthContext } from "./context";

function defaultReplace(href: string) {
	window.location.replace(href);
}

type AuthProviderProps = {
	children: React.ReactNode;
	replace?: ReplaceFn;
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

	const values = useMemo(
		() => ({
			replace: replaceFn,
			authClient,
		}),
		[replaceFn, authClient]
	);

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

import { useMemo } from "react";
import type { AuthClient, ReplaceFn } from "../types";
import { AuthContext } from "./context";

function defaultReplace(href: string) {
	window.location.replace(href);
}

type AuthProviderProps = {
	children: React.ReactNode;
	authClient: AuthClient;
	replace?: ReplaceFn;
};

export const AuthProvider = ({
	children,
	replace,
	authClient,
}: AuthProviderProps) => {
	const replaceFn = useMemo(() => replace || defaultReplace, [replace]);

	const values = useMemo(
		() => ({
			replace: replaceFn,
			authClient,
		}),
		[replaceFn, authClient]
	);

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

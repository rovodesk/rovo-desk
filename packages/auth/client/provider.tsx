"use client";

import { useMemo } from "react";
import type { AuthClient, ReplaceFn } from "../types";
import { createAuthClient } from "./auth-client";
import { AuthContext } from "./context";
import { keys } from "./keys";

function defaultReplace(href: string) {
	window.location.replace(href);
}

const defaultAuthClient = createAuthClient(
	keys.VITE_AUTH_SERVER_URL,
	keys.VITE_AUTH_SERVER_BASE_PATH,
)

type AuthProviderProps = {
	children: React.ReactNode;
	authClient?: AuthClient;
	replace?: ReplaceFn;
};

export const AuthProvider = ({
	children,
	replace,
	authClient,
}: AuthProviderProps) => {
	const replaceFn = useMemo(() => replace ?? defaultReplace, [replace]);

	const client = useMemo(() => authClient ?? defaultAuthClient, [authClient]);

	const values = useMemo(
		() => ({
			replace: replaceFn,
			authClient: client,
		}),
		[replaceFn, client]
	);

	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

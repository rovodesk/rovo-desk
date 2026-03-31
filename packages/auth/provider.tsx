"use client";

import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import type { ReactNode } from "react";

type AuthProviderProps = {
	children: ReactNode;
	clientId: string;
	domain: string;
	logoutUri: string;
	redirectUri: string;
	audience?: string;
};

export const AuthProvider = ({
	children,
	clientId,
	domain,
	logoutUri,
	redirectUri,
	audience,
}: AuthProviderProps) => {
	return (
		<KindeProvider
			audience={audience}
			clientId={clientId}
			domain={domain}
			logoutUri={logoutUri}
			redirectUri={redirectUri}
		>
			{children}
		</KindeProvider>
	);
};

export default AuthProvider;

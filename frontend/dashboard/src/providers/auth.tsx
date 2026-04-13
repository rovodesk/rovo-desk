/** biome-ignore-all lint/correctness/useExhaustiveDependencies: intentional stable auth provider API */
"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { baseUrl } from "../lib/api-client";
import type {
	AuthContextType,
	SessionData,
	SessionResponse,
	SocialLoginOptions,
	UserData,
} from "../types/auth";

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
	children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<UserData | null>(null);
	const [session, setSession] = useState<SessionData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchSession = useCallback(async (): Promise<SessionResponse> => {
		const res = await fetch(baseUrl("/auth/session"), {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		// Session endpoint should always return 200
		if (!res.ok) {
			throw new Error(`Failed to fetch session: ${res.status}`);
		}

		const data = await res.json();
		console.log("Session Data", data);

		return data as SessionResponse;
	}, []);

	const refreshSession = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const session = await fetchSession();

			if (session.session && session.user) {
				setUser(session.user);
				setSession(session.session);
			} else {
				setUser(null);
				setSession(null);
			}
		} catch (err) {
			console.error("Failed to refresh session", err);
			setError(err instanceof Error ? err.message : "Unknown auth error");
			setUser(null);
			setSession(null);
		} finally {
			setIsLoading(false);
		}
	}, [fetchSession]);

	useEffect(() => {
		refreshSession();
	}, [refreshSession]);

	const socialLogin = useCallback(
		({ provider = "google", returnTo }: SocialLoginOptions = {}) => {
			const url = baseUrl("/auth/login/social");

			url.searchParams.set("provider", provider);
			url.searchParams.set("returnTo", returnTo ?? window.location.href);

			window.location.assign(url.toString());
		},
		[]
	);

	const logout = useCallback((returnTo?: string) => {
		const url = baseUrl("/auth/logout");

		if (returnTo) {
			url.searchParams.set("returnTo", returnTo);
		}

		// MUST be full-page navigation
		window.location.assign(url.toString());
	}, []);

	const value = useMemo<AuthContextType>(
		() => ({
			user,
			session,
			isAuthenticated: !!user,
			isLoading,
			error,
			socialLogin,
			logout,
			refreshSession,
		}),
		[user, isLoading, error, socialLogin, logout, refreshSession]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

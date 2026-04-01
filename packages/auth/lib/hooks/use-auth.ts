import {
	type KindeContextProps,
	useKindeAuth,
} from "@kinde-oss/kinde-auth-react";

export type UseAuthReturnType = Pick<
	KindeContextProps,
	"isAuthenticated" | "isLoading" | "register" | "login" | "logout"
>;

export const useAuth = (): UseAuthReturnType => {
	const { isAuthenticated, isLoading, register, login, logout } =
		useKindeAuth();

	return {
		isAuthenticated,
		isLoading,
		register,
		login,
		logout,
	};
};

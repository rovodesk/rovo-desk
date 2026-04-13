export type TokenResponse = {
	access_token: string;
	id_token: string;
	refresh_token?: string;
	expires_in: number;
	token_type: string;
};

export type SessionData = {
	userId: string;
	email?: string;
	name?: string;
	provider?: string;
	idToken?: string;
	accessToken?: string;
	refreshToken?: string;
	deviceId?: string;
	ip?: string;
	userAgent?: string;
	createdAt: string;
	lastSeenAt: string;
	mfaVerified: boolean;
};

export type UserData = {
	id: string;
	email: string;
	name: string;
	picture: string;
};

export type SessionResponse = {
	session: SessionData;
	user: UserData;
};

export type AuthContextType = {
	user: UserData | null;
	session: SessionData | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	socialLogin: (options: SocialLoginOptions) => void;
	logout: (returnTo?: string) => void;
	refreshSession: () => Promise<void>;
};

export type SocialProvider = "google" | "github" | "linear";

export type SocialLoginOptions = {
	provider?: SocialProvider;
	returnTo?: string;
};

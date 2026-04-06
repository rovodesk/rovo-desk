import { z } from "zod";

export const AuthSharedConfig = {
	callbackUrl: "http://localhost:4000/auth/callback",
	allowedRedirects: [
		"http://localhost:3002",
		"http://localhost:3000",
	] as string[],
	postLoginRedirect: "http://localhost:3002",
	postLogoutRedirect: "http://localhost:3000",
	errorRedirect: "http://localhost:3002",
};

export const providerSchema = z.enum(["google", "github", "linear"]);

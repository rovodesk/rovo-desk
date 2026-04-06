import type { OAuthStateData } from "@zero-heads-lab/auth/server";
import {
	CacheCluster,
	expireInMinutes,
	IntKeyspace,
	StringKeyspace,
	StructKeyspace,
} from "encore.dev/storage/cache";

const cluster = CacheCluster.named("shared-cache");

export const oauthStates = new StructKeyspace<
	{ state: string },
	OAuthStateData
>(cluster, {
	keyPattern: "auth/oauth-state/:state",
	defaultExpiry: expireInMinutes(10),
});

export const magicLinks = new StringKeyspace<{ email: string }>(cluster, {
	keyPattern: "auth/magic-link/:email",
	defaultExpiry: expireInMinutes(15),
});

/**
 * OTP / verification code storage
 * Redis key: auth/otp/:email
 */
export const otpCodes = new StringKeyspace<{ email: string }>(cluster, {
	keyPattern: "auth/otp/:email",
	defaultExpiry: expireInMinutes(10),
});

/**
 * Login attempt counter
 * Redis key: auth/login-attempts/:subject
 */
export const loginAttempts = new IntKeyspace<{ subject: string }>(cluster, {
	keyPattern: "auth/login-attempts/:subject",
	defaultExpiry: expireInMinutes(15),
});

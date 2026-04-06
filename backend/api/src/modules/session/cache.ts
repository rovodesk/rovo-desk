import {
	CacheCluster,
	expireInHours,
	expireInMinutes,
	StructKeyspace,
} from "encore.dev/storage/cache";
import type { AnonymousSession, AuthenticatedSession } from "./types";

const cluster = CacheCluster.named("shared-cache");

export const sessionCache = new StructKeyspace<
	{ sessionId: string },
	AuthenticatedSession
>(cluster, {
	keyPattern: "auth/session/:sessionId",
	defaultExpiry: expireInHours(24 * 7),
});

export const anonymousSessionCache = new StructKeyspace<
	{ accessToken: string },
	AnonymousSession
>(cluster, {
	keyPattern: "auth/email-otp-login/:accessToken",
	defaultExpiry: expireInMinutes(10),
});

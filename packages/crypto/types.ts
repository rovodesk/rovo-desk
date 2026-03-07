import type { JWTPayload as JoseJWTPayload } from "jose";

export interface JWTPayload extends JoseJWTPayload {
	keyId?: string;
	orgId?: string;
	userId?: string;
	connectionId?: string;
	role?: TokenRoles;
}

export type TokenRoles = "anonymous" | "authenticated" | "ai";

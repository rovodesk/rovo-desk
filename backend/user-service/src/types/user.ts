import type { Identity } from "./identity";
import type { Session } from "./session";

export type User = {
	id: string;
	identities: Identity[];
	sessions: Session[];

	firstName?: string | null;
	lastName?: string | null;
	avatarUrl?: string | null;
	online: boolean;
	lastSeenAt?: Date | null;
	cognitoSub?: string | null;
	ban: BanOptions;

	metadata: Record<string, unknown>;
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date | null;
};

export type BanOptions = {
	banned: boolean;
	bannedReason?: string | null;
	bannedAt?: Date | null;
	bannedExpiresAt?: Date | null;
};

export type UserStatus = "active" | "suspended" | "banned" | "deleted";

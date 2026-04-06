import type { SelectUserType, UpdateUserType } from "./types";

/**
 * Interface representing the core User domain behaviors.
 */
export interface IUser {
	updateProfile(
		input: Partial<Pick<UpdateUserType, "firstName" | "lastName">>
	): void;
	ban(input?: { reason?: string | null; expiresAt?: Date | null }): void;
	unban(): void;
	softDelete(): void;
	restore(): void;
	toObject(): SelectUserType;
}

export class User implements IUser {
	private readonly props: SelectUserType;

	/**
	 * Private constructor to enforce the use of static factory methods.
	 * Use User.create() for new users and User.rehydrate() for DB records.
	 */
	private constructor(props: SelectUserType) {
		this.props = props;
	}

	/* =========================================================
	 * FACTORIES
	 * ========================================================= */

	/**
	 * Creates a brand new User instance with default values.
	 */
	static create(input: {
		externalId: string;
		preferedEmail?: string;
		firstName?: string | null;
		lastName?: string | null;
		metadata?: Record<string, unknown>;
		createdAt?: string | Date;
	}): User {
		const now = new Date();
		return new User({
			id: crypto.randomUUID(),
			externalId: input.externalId,
			firstName: input.firstName ?? null,
			lastName: input.lastName ?? null,
			preferedEmail: input.preferedEmail ?? null,
			online: true,
			metadata: input.metadata ?? {},
			lastSeenAt: null,
			avatarUrl: null,
			createdAt: new Date(input.createdAt ?? now),
			updatedAt: now,
			deletedAt: null,
			banned: false,
			bannedAt: null,
			bannedExpiresAt: null,
			bannedReason: null,
		});
	}

	/**
	 * Reconstitutes an existing User from the database.
	 */
	static rehydrate(input: SelectUserType): User {
		return new User(input);
	}

	/* =========================================================
	 * GETTERS
	 * ========================================================= */

	get id(): string {
		return this.props.id;
	}
	get externalId(): string {
		return this.props.externalId;
	}
	get firstName(): string | null {
		return this.props.firstName;
	}
	get lastName(): string | null {
		return this.props.lastName;
	}
	get isOnline(): boolean {
		return this.props.online;
	}
	get createdAt(): Date {
		return this.props.createdAt;
	}
	get updatedAt(): Date {
		return this.props.updatedAt;
	}
	get deletedAt(): Date | null {
		return this.props.deletedAt;
	}
	get banned(): boolean {
		return this.props.banned;
	}

	/**
	 * Derives the full name from first and last name.
	 */
	get fullName(): string {
		return [this.props.firstName, this.props.lastName]
			.filter(Boolean)
			.join(" ")
			.trim();
	}

	/**
	 * Checks if the user is currently banned, accounting for expiration dates.
	 */
	get isCurrentlyBanned(): boolean {
		if (!this.props.banned) return false;
		if (!this.props.bannedExpiresAt) return true;
		return this.props.bannedExpiresAt.getTime() > Date.now();
	}

	/* =========================================================
	 * BEHAVIOR (Domain Logic)
	 * ========================================================= */

	/**
	 * Updates profile information and normalizes email if provided.
	 */
	updateProfile(input: {
		firstName?: string | null;
		lastName?: string | null;
	}) {
		if (input.firstName !== undefined) {
			this.props.firstName = input.firstName;
		}
		if (input.lastName !== undefined) {
			this.props.lastName = input.lastName;
		}
		this.touch();
	}

	/**
	 * Places the user in a banned state.
	 */
	ban(input?: { reason?: string | null; expiresAt?: Date | null }) {
		this.props.banned = true;
		this.props.bannedAt = new Date();
		this.props.bannedExpiresAt = input?.expiresAt ?? null;
		this.props.bannedReason = input?.reason ?? null;
		this.touch();
	}

	/**
	 * Removes the ban and clears ban-related metadata.
	 */
	unban() {
		this.props.banned = false;
		this.props.bannedAt = null;
		this.props.bannedExpiresAt = null;
		this.props.bannedReason = null;
		this.touch();
	}

	/**
	 * Marks the user as deleted without removing them from the store.
	 */
	softDelete() {
		if (this.props.deletedAt) return;
		this.props.deletedAt = new Date();
		this.touch();
	}

	/**
	 * Reverses a soft delete.
	 */
	restore() {
		this.props.deletedAt = null;
		this.touch();
	}

	/**
	 * Toggles the online status.
	 * If setting to true, we don't necessarily update lastSeenAt.
	 * If setting to false, we record the current time as lastSeenAt.
	 */
	toggleOnline(): void {
		this.props.online = !this.props.online;

		if (!this.props.online) {
			this.props.lastSeenAt = new Date();
		}

		this.touch(); // Updates updatedAt
	}

	/* =========================================================
	 * SERIALIZATION
	 * ========================================================= */

	/**
	 * Converts the domain entity back into a plain data object.
	 */
	toObject(): SelectUserType {
		return { ...this.props };
	}

	/* =========================================================
	 * INTERNALS
	 * ========================================================= */

	private touch() {
		this.props.updatedAt = new Date();
	}
}

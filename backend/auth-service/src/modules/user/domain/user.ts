export type UserProps = {
	id: string;
	email: string;
	externalId: string;

	firstName?: string | null;
	lastName?: string | null;

	metadata?: Record<string, unknown> | null;

	createdAt: Date;
	updatedAt: Date;

	deletedAt?: Date | null;

	banned: boolean;
	bannedAt?: Date | null;
	bannedExpiresAt?: Date | null;
	bannedReason?: string | null;
};

export type CreateUserProps = Omit<
	UserProps,
	| "id"
	| "createdAt"
	| "updatedAt"
	| "deletedAt"
	| "banned"
	| "bannedAt"
	| "bannedExpiresAt"
	| "bannedReason"
> & {
	id: string;
	firstName?: string | null;
	lastName?: string | null;
};

export type UpdateUserProps = {
	id: string;
} & Partial<CreateUserProps>;

export interface IUser {
	updateProfile(input: UpdateUserProps): void;
	ban(input?: { reason?: string | null; expiresAt?: Date | null }): void;
	unban(): void;
	softDelete(): void;
	restore(): void;
	toObject(): UserProps;
}

export class User implements IUser {
	private readonly props: UserProps;

	constructor(props: CreateUserProps) {
		this.props = {
			id: props.id,
			email: User.normalizeEmail(props.email),
			externalId: props.externalId,
			firstName: props.firstName,
			lastName: props.lastName,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			banned: false,
			bannedAt: null,
			bannedExpiresAt: null,
			bannedReason: null,
		};
	}

	/* =========================================================
	 * FACTORIES
	 * ========================================================= */

	static rehydrate(input: UserProps): User {
		return new User({
			...input,
			email: User.normalizeEmail(input.email),
		});
	}

	/* =========================================================
	 * GETTERS
	 * ========================================================= */

	get id(): string {
		return this.props.id;
	}

	get email(): string {
		return this.props.email;
	}

	get externalId(): string {
		return this.props.externalId;
	}

	get firstName(): string | null | undefined {
		return this.props.firstName;
	}

	get lastName(): string | null | undefined {
		return this.props.lastName;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	get deletedAt(): Date | null | undefined {
		return this.props.deletedAt;
	}

	get banned(): boolean {
		return this.props.banned;
	}

	get bannedAt(): Date | null | undefined {
		return this.props.bannedAt;
	}

	get bannedExpiresAt(): Date | null | undefined {
		return this.props.bannedExpiresAt;
	}

	get bannedReason(): string | null | undefined {
		return this.props.bannedReason;
	}

	get fullName(): string {
		return [this.props.firstName, this.props.lastName]
			.filter(Boolean)
			.join(" ")
			.trim();
	}

	get isDeleted(): boolean {
		return !!this.props.deletedAt;
	}

	get isCurrentlyBanned(): boolean {
		if (!this.props.banned) return false;
		if (!this.props.bannedExpiresAt) return true;

		return this.props.bannedExpiresAt.getTime() > Date.now();
	}

	/* =========================================================
	 * BEHAVIOR
	 * ========================================================= */

	updateProfile(input: {
		firstName?: string | null;
		lastName?: string | null;
		email?: string;
	}) {
		if (input.email !== undefined) {
			this.props.email = User.normalizeEmail(input.email);
		}

		if (input.firstName !== undefined) {
			this.props.firstName = input.firstName;
		}

		if (input.lastName !== undefined) {
			this.props.lastName = input.lastName;
		}

		this.touch();
	}

	ban(input?: { reason?: string | null; expiresAt?: Date | null }) {
		this.props.banned = true;
		this.props.bannedAt = new Date();
		this.props.bannedExpiresAt = input?.expiresAt ?? null;
		this.props.bannedReason = input?.reason ?? null;

		this.touch();
	}

	unban() {
		this.props.banned = false;
		this.props.bannedAt = null;
		this.props.bannedExpiresAt = null;
		this.props.bannedReason = null;

		this.touch();
	}

	softDelete() {
		if (this.props.deletedAt) return;

		this.props.deletedAt = new Date();
		this.touch();
	}

	restore() {
		this.props.deletedAt = null;
		this.touch();
	}

	/* =========================================================
	 * SERIALIZATION
	 * ========================================================= */

	toObject(): UserProps {
		return { ...this.props };
	}

	/* =========================================================
	 * INTERNALS
	 * ========================================================= */

	private touch() {
		this.props.updatedAt = new Date();
	}

	private static normalizeEmail(email: string): string {
		const normalized = email.trim().toLowerCase();

		if (!normalized) {
			throw new Error("User email is required");
		}

		return normalized;
	}
}

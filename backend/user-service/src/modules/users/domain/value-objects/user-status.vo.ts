import { InvalidUserStatusError } from "../errors/user.errors";

export const USER_STATUSES = [
	"active",
	"suspended",
	"banned",
	"deleted",
] as const;

export type UserStatusValue = (typeof USER_STATUSES)[number];

export class UserStatus {
	private constructor(private readonly _value: UserStatusValue) {}

	static create(value: string): UserStatus {
		if (!USER_STATUSES.includes(value as UserStatusValue)) {
			throw new InvalidUserStatusError(value);
		}

		return new UserStatus(value as UserStatusValue);
	}

	static active(): UserStatus {
		return new UserStatus("active");
	}

	static suspended(): UserStatus {
		return new UserStatus("suspended");
	}

	static banned(): UserStatus {
		return new UserStatus("banned");
	}

	static deleted(): UserStatus {
		return new UserStatus("deleted");
	}

	get value(): UserStatusValue {
		return this._value;
	}

	equals(other: UserStatus): boolean {
		return this._value === other._value;
	}

	isActive(): boolean {
		return this._value === "active";
	}

	isSuspended(): boolean {
		return this._value === "suspended";
	}

	isBanned(): boolean {
		return this._value === "banned";
	}

	isDeleted(): boolean {
		return this._value === "deleted";
	}
}

import { InvalidSessionStatusError } from "../errors/user.errors";

export const SESSION_STATUSES = [
	"active",
	"revoked",
	"expired",
	"ended",
	"suspended",
] as const;

export type SessionStatusType = (typeof SESSION_STATUSES)[number];

export class Status {
	private constructor(private readonly _value: SessionStatusType) {}

	static create(value: string): Status {
		if (!SESSION_STATUSES.includes(value as SessionStatusType)) {
			throw new InvalidSessionStatusError(value);
		}

		return new Status(value as SessionStatusType);
	}

	static active(): Status {
		return new Status("active");
	}

	static revoked(): Status {
		return new Status("revoked");
	}

	static expired(): Status {
		return new Status("expired");
	}

	static ended(): Status {
		return new Status("ended");
	}

	static suspended(): Status {
		return new Status("suspended");
	}

	get value(): SessionStatusType {
		return this._value;
	}

	equals(other: Status): boolean {
		return this._value === other._value;
	}

	isActive(): boolean {
		return this._value === "active";
	}

	isRevoked(): boolean {
		return this._value === "revoked";
	}

	isExpired(): boolean {
		return this._value === "expired";
	}

	isEnded(): boolean {
		return this._value === "ended";
	}

	isSuspended(): boolean {
		return this._value === "suspended";
	}
}

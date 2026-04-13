import { InvalidEmailError } from "../errors";

export class UserEmail {
	private constructor(
		private readonly value: string,
		private readonly verified: boolean,
		private readonly verifiedAt: Date | null,
		private readonly linkedAt: Date
	) {}

	static create(email: string): UserEmail {
		const normalized = email.trim().toLowerCase();

		if (!UserEmail.isValid(normalized)) {
			throw new InvalidEmailError(normalized);
		}

		return new UserEmail(normalized, false, null, new Date());
	}

	static fromPersistence(
		value: string,
		verified: boolean,
		verifiedAt: Date | null,
		linkedAt: Date
	): UserEmail {
		const normalized = value.trim().toLowerCase();

		if (!UserEmail.isValid(normalized)) {
			throw new InvalidEmailError(normalized);
		}

		return new UserEmail(normalized, verified, verifiedAt, linkedAt);
	}

	verify(now = new Date()): UserEmail {
		if (this.verified) return this;
		return new UserEmail(this.value, true, now, this.linkedAt);
	}

	unverify(): UserEmail {
		return new UserEmail(this.value, false, null, this.linkedAt);
	}

	change(newEmail: string): UserEmail {
		const normalized = newEmail.trim().toLowerCase();

		if (!UserEmail.isValid(normalized)) {
			throw new InvalidEmailError(normalized);
		}

		if (normalized === this.value) return this;

		return new UserEmail(normalized, false, null, new Date());
	}

	get Value(): string {
		return this.value;
	}

	get isVerified(): boolean {
		return this.verified;
	}

	get verifiedOn(): Date | null {
		return this.verifiedAt;
	}

	get linkedOn(): Date {
		return this.linkedAt;
	}

	equals(email: UserEmail): boolean {
		return this.value === email.value;
	}

	private static isValid(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}
}

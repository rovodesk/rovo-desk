import { generateCUID, isValidCUID } from "@zero-heads-lab/shared/utils";
import { InvalidUserIdError } from "../errors";

export class UserId {
	private constructor(private readonly value: string) {}

	/**
	 * Generate a new UserId (for new users)
	 */
	static generate(): UserId {
		const id = generateCUID("user");
		return new UserId(id);
	}

	/**
	 * Create from external input (API, DTO)
	 */
	static create(id: string): UserId {
		if (!id?.trim()) {
			throw new InvalidUserIdError(id);
		}

		if (!UserId.isValid(id)) {
			throw new InvalidUserIdError(id);
		}

		return new UserId(id);
	}

	/**
	 * Hydrate from database (trusted source)
	 */
	static fromPersistence(id: string): UserId {
		if (!id) {
			throw new InvalidUserIdError(id);
		}

		if (!UserId.isValid(id)) {
			throw new InvalidUserIdError(id);
		}

		return new UserId(id);
	}

	// ---------------- getters ----------------

	get Value(): string {
		return this.value;
	}

	toString(): string {
		return this.value;
	}

	// ---------------- equality ----------------

	equals(other: UserId): boolean {
		return this.value === other.value;
	}

	// ---------------- validation ----------------

	private static isValid(id: string): boolean {
		return isValidCUID(id);
	}
}

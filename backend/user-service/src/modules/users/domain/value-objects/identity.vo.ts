import { InvalidProviderUserIdError } from "../errors/user.errors";
import type { IdentityProvider } from "./provider.vo";

export class Identity {
	private constructor(
		private readonly _provider: IdentityProvider,
		private readonly _providerUserId: string,
		private readonly _email: string | null,
		private readonly isPrimary: boolean,
		private readonly linkedAt: Date
	) {
		if (!this._providerUserId.trim()) {
			throw new InvalidProviderUserIdError();
		}
	}

	get isPrimaryIdentity(): boolean {
		return this.isPrimary;
	}

	get provider(): IdentityProvider {
		return this._provider;
	}

	get providerUserId(): string {
		return this._providerUserId;
	}

	get email(): string | null {
		return this._email;
	}

	get linkedAtIdentity(): Date {
		return this.linkedAt;
	}

	static create({
		provider,
		providerUserId,
		email,
		isPrimary,
		linkedAt,
	}: {
		provider: IdentityProvider;
		providerUserId: string;
		email: string | null;
		isPrimary: boolean;
		linkedAt: Date;
	}): Identity {
		return new Identity(provider, providerUserId, email, isPrimary, linkedAt);
	}

	equals(other: Identity): boolean {
		return (
			this.provider.equals(other.provider) &&
			this.providerUserId === other.providerUserId
		);
	}

	markPrimary(): Identity {
		if (this.isPrimary) return this;

		return new Identity(
			this.provider,
			this.providerUserId,
			this.email,
			true,
			this.linkedAt
		);
	}

	unmarkPrimary(): Identity {
		if (!this.isPrimary) return this;

		return new Identity(
			this.provider,
			this.providerUserId,
			this.email,
			false,
			this.linkedAt
		);
	}
}

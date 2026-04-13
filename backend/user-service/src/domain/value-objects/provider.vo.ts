import { InvalidProviderError } from "../errors";

export const IDENTITY_PROVIDERS = [
	"password",
	"google",
	"github",
	"apple",
	"oidc",
	"saml",
	"magic_link",
	"cognito",
] as const;

export type IdentityProviderValue = (typeof IDENTITY_PROVIDERS)[number];

export class IdentityProvider {
	private constructor(private readonly value: IdentityProviderValue) {}

	static create(value: string): IdentityProvider {
		if (!IDENTITY_PROVIDERS.includes(value as IdentityProviderValue)) {
			throw new InvalidProviderError(value);
		}

		return new IdentityProvider(value as IdentityProviderValue);
	}

	get Value(): IdentityProviderValue {
		return this.value;
	}

	equals(other: IdentityProvider): boolean {
		return this.value === other.value;
	}
}

import { Identity } from "@/domain/value-objects/identity.vo";
import { IdentityProvider } from "@/domain/value-objects/provider.vo";
import type { IEventBusPort } from "../ports/event-bus.port";
import type { IUserRepository } from "../ports/user.repository.port";

export interface LinkIdentityUseCaseInput {
	userId: string;
	provider: string;
	providerUserId: string;
	email?: string | null;
	isPrimary?: boolean;
}

export class LinkIdentityUseCase {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly eventBus: IEventBusPort
	) {}

	async execute(input: LinkIdentityUseCaseInput): Promise<void> {
		const user = await this.userRepository.findById(input.userId);

		if (!user) {
			throw new Error("User not found");
		}

		const existing = await this.userRepository.findByIdentity(
			input.provider,
			input.providerUserId
		);

		if (existing && !existing.Id.equals(user.Id)) {
			throw new Error("Identity already linked to another user");
		}

		const identity = Identity.create({
			provider: IdentityProvider.create(input.provider),
			providerUserId: input.providerUserId,
			email: input.email ?? null,
			isPrimary: input.isPrimary ?? false,
			linkedAt: new Date(),
		});

		user.linkIdentity(identity);

		await this.userRepository.save(user);

		await this.eventBus.publish({
			name: "auth.identity.linked",
			aggregateId: user.Id.Value,
			occurredAt: new Date(),
			payload: {
				userId: user.Id.Value,
				provider: input.provider,
				providerUserId: input.providerUserId,
			},
		});
	}
}

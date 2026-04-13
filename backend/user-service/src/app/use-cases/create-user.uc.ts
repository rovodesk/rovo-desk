import { generateCUID } from "@zero-heads-lab/shared/utils";
import type { UserService } from "@/domain/service";
import { Identity } from "@/domain/value-objects/identity.vo";
import { IdentityProvider } from "@/domain/value-objects/provider.vo";
import type { IEventBusPort } from "../ports/event-bus.port";
import type { IUserRepository } from "../ports/user.repository.port";

export interface CreateUserUseCaseInput {
	email: string;
	provider: string;
	providerUserId: string;
	isPrimary?: boolean;
}

export interface CreateUserUseCaseOutput {
	userId: string;
	email: string;
}

export class CreateUserUseCase {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly userService: UserService,
		private readonly eventBus: IEventBusPort
	) {}

	async execute(
		input: CreateUserUseCaseInput
	): Promise<CreateUserUseCaseOutput> {
		const existing = await this.userRepository.findByIdentity(
			input.provider,
			input.providerUserId
		);

		if (existing) {
			throw new Error("User already exists for this identity");
		}

		const identity = Identity.create({
			provider: IdentityProvider.create(input.provider),
			providerUserId: input.providerUserId,
			email: input.email,
			isPrimary: input.isPrimary ?? true,
			linkedAt: new Date(),
		});

		const user = this.userService.createUser({
			id: generateCUID("user"),
			email: input.email,
			identity,
		});

		await this.userRepository.save(user);

		await this.eventBus.publish({
			name: "auth.user.created",
			aggregateId: user.Id.Value,
			occurredAt: new Date(),
			payload: {
				userId: user.Id.Value,
				email: user.Email.Value,
				provider: input.provider,
			},
		});

		return {
			userId: user.Id.Value,
			email: user.Email.Value,
		};
	}
}

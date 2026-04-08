import { Injectable } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import { generateCUID } from "@zero-heads-lab/shared/utils";
import type { IEventBusPort } from "../../application/ports/event-bus.port";
import type { IUserRepository } from "../../domain/repositories/user.repository.port";
import type { UserService } from "../../domain/services/user.service";
import { Identity } from "../../domain/value-objects/identity.vo";
import { IdentityProvider } from "../../domain/value-objects/provider.vo";
import { CreateUserCommand } from "./create-user.command";

export interface CreateUserCommandOutput {
	userId: string;
	email: string;
}

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
	implements ICommandHandler<CreateUserCommand, CreateUserCommandOutput>
{
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly userService: UserService,
		private readonly eventBus: IEventBusPort
	) {}

	async execute(command: CreateUserCommand): Promise<CreateUserCommandOutput> {
		const { input } = command;

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

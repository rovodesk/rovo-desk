import { Injectable } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import type { IUserRepository } from "../../../users/domain/repositories/user.repository.port";
import { Identity } from "../../../users/domain/value-objects/identity.vo";
import { IdentityProvider } from "../../../users/domain/value-objects/provider.vo";
import type { IEventBusPort } from "../../ports/event-bus.port";
import { LinkIdentityCommand } from "./link-identity.command";

@Injectable()
@CommandHandler(LinkIdentityCommand)
export class LinkIdentityCommandHandler
	implements ICommandHandler<LinkIdentityCommand, void>
{
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly eventBus: IEventBusPort
	) {}

	async execute(command: LinkIdentityCommand): Promise<void> {
		const { input } = command;

		const user = await this.userRepository.findById(input.userId);

		if (!user) {
			throw new Error("User not found");
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
				email: input.email,
			},
		});
	}
}

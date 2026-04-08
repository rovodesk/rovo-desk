import { Injectable } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import type { IUserRepository } from "../../../users/domain/repositories/user.repository.port";
import type { IEventBusPort } from "../../ports/event-bus.port";
import { UnlinkIdentityCommand } from "./unlink-identity.command";

@Injectable()
@CommandHandler(UnlinkIdentityCommand)
export class UnlinkIdentityCommandHandler
	implements ICommandHandler<UnlinkIdentityCommand, void>
{
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly eventBus: IEventBusPort
	) {}

	async execute(command: UnlinkIdentityCommand): Promise<void> {
		const { input } = command;

		const user = await this.userRepository.findById(input.userId);

		if (!user) {
			throw new Error("User not found");
		}

		user.unlinkIdentity(input.provider, input.providerUserId);

		await this.userRepository.save(user);

		await this.eventBus.publish({
			name: "auth.identity.unlinked",
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

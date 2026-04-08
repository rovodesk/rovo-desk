import { Injectable } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import type { IUserRepository } from "../../domain/repositories/user.repository.port";
import { UserEmail } from "../../domain/value-objects/email.vo";
import type { IEventBusPort } from "../ports/event-bus.port";
import { UpdateEmailCommand } from "./update-email.command";

@Injectable()
@CommandHandler(UpdateEmailCommand)
export class UpdateEmailCommandHandler
	implements ICommandHandler<UpdateEmailCommand, void>
{
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly eventBus: IEventBusPort
	) {}

	async execute(command: UpdateEmailCommand): Promise<void> {
		const { input } = command;

		const user = await this.userRepository.findById(input.userId);

		if (!user) {
			throw new Error("User not found");
		}

		const newEmail = UserEmail.create(input.email);
		user.updateEmail(newEmail);

		await this.userRepository.save(user);

		await this.eventBus.publish({
			name: "auth.user.email.updated",
			aggregateId: user.Id.Value,
			occurredAt: new Date(),
			payload: {
				userId: user.Id.Value,
				email: newEmail.Value,
			},
		});
	}
}

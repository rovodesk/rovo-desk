import { Injectable } from "@nestjs/common";
import {
	CommandHandler,
	type EventBus,
	type ICommandHandler,
} from "@nestjs/cqrs";
import type { IUserRepository } from "../../domain/repositories/user.repository.port";
import {
	RevokeSessionCommand,
	type RevokeSessionCommandOutput,
} from "./revoke-session.command";

@CommandHandler(RevokeSessionCommand)
@Injectable()
export class RevokeSessionCommandHandler
	implements ICommandHandler<RevokeSessionCommand, RevokeSessionCommandOutput>
{
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly eventBus: EventBus
	) {}

	async execute(
		command: RevokeSessionCommand
	): Promise<RevokeSessionCommandOutput> {
		const { userId, sessionId } = command.input;

		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new Error(`User with ID ${userId} not found`);
		}

		// Get the session before revoking to capture revoke time
		const sessions = user.Sessions;
		const session = sessions.find((s) => s.id === sessionId);
		if (!session) {
			throw new Error(
				`Session with ID ${sessionId} not found for user ${userId}`
			);
		}

		// Revoke the session on the aggregate
		user.revokeSession(sessionId);

		// Persist the changes
		await this.userRepository.save(user);

		// Publish domain events
		// Events would be captured from user aggregate if implemented
		// For now, manually track the revoke action

		return {
			userId,
			sessionId,
			revokedAt: new Date(),
		};
	}
}

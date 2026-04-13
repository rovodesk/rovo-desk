import { Injectable } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import type { IUserRepository } from "../../domain/repositories/user.repository.port";
import {
	RevokeAllSessionsCommand,
	type RevokeAllSessionsCommandOutput,
} from "./revoke-all-sessions.command";

@CommandHandler(RevokeAllSessionsCommand)
@Injectable()
export class RevokeAllSessionsCommandHandler
	implements
		ICommandHandler<RevokeAllSessionsCommand, RevokeAllSessionsCommandOutput>
{
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(
		command: RevokeAllSessionsCommand
	): Promise<RevokeAllSessionsCommandOutput> {
		const { userId } = command.input;

		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new Error(`User with ID ${userId} not found`);
		}

		const activeSessions = user.ActiveSessions;
		const revokedCount = activeSessions.length;

		// Revoke all sessions on the aggregate
		user.revokeAllSessions();

		// Persist the changes
		await this.userRepository.save(user);

		return {
			userId,
			revokedCount,
			revokedAt: new Date(),
		};
	}
}

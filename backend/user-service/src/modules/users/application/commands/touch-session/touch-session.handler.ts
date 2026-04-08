import { Injectable } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import type { IUserRepository } from "../../domain/repositories/user.repository.port";
import {
	TouchSessionCommand,
	type TouchSessionCommandOutput,
} from "./touch-session.command";

@CommandHandler(TouchSessionCommand)
@Injectable()
export class TouchSessionCommandHandler
	implements ICommandHandler<TouchSessionCommand, TouchSessionCommandOutput>
{
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(
		command: TouchSessionCommand
	): Promise<TouchSessionCommandOutput> {
		const { userId, sessionId } = command.input;

		const user = await this.userRepository.findById(userId);
		if (!user) {
			throw new Error(`User with ID ${userId} not found`);
		}

		// Touch the session on the aggregate
		user.touchSession(sessionId);

		// Persist the changes
		await this.userRepository.save(user);

		return {
			userId,
			sessionId,
			lastSeenAt: new Date(),
		};
	}
}

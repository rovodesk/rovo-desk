import type { IEventBusPort } from "../ports/event-bus.port";
import type { ISessionRepository } from "../ports/session.repository.port";
import type { IUserRepository } from "../ports/user.repository.port";

export interface RevokeSessionUseCaseInput {
	userId: string;
	sessionId: string;
}

export class RevokeSessionUseCase {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly sessionRepository: ISessionRepository,
		private readonly eventBus: IEventBusPort
	) {}

	async execute(input: RevokeSessionUseCaseInput): Promise<void> {
		const user = await this.userRepository.findById(input.userId);

		if (!user) {
			throw new Error("User not found");
		}

		user.revokeSession(input.sessionId);

		await this.userRepository.save(user);
		await this.sessionRepository.revoke(input.sessionId);

		await this.eventBus.publish({
			name: "auth.session.revoked",
			aggregateId: user.Id.Value,
			occurredAt: new Date(),
			payload: {
				userId: user.Id.Value,
				sessionId: input.sessionId,
			},
		});
	}
}

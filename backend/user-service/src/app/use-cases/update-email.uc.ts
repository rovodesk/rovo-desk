import { UserEmail } from "@/domain/value-objects/email.vo";
import type { IEventBusPort } from "../ports/event-bus.port";
import type { IUserRepository } from "../ports/user.repository.port";

export interface UpdateEmailUseCaseInput {
	userId: string;
	email: string;
}

export class UpdateEmailUseCase {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly eventBus: IEventBusPort
	) {}

	async execute(input: UpdateEmailUseCaseInput): Promise<void> {
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
				email: user.Email.Value,
			},
		});
	}
}

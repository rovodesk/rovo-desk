import { Injectable, Logger } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import { generateCUID } from "@zero-heads-lab/shared/utils";
import type { IUserRepository } from "../../modules/users/domain/repositories/user.repository.port";
import { Session } from "../../modules/users/domain/value-objects/session.vo";
import type { IIdentityProviderPort } from "../ports/identity-provider.port";
import type { ITokenServicePort } from "../ports/token-service.port";
import {
	AuthenticateWithPasswordCommand,
	type AuthenticateWithPasswordCommandOutput,
} from "./authenticate-with-password.command";

@CommandHandler(AuthenticateWithPasswordCommand)
@Injectable()
export class AuthenticateWithPasswordCommandHandler
	implements
		ICommandHandler<
			AuthenticateWithPasswordCommand,
			AuthenticateWithPasswordCommandOutput
		>
{
	private readonly logger = new Logger(
		AuthenticateWithPasswordCommandHandler.name
	);

	constructor(
		private readonly userRepository: IUserRepository,
		private readonly identityProvider: IIdentityProviderPort,
		private readonly tokenService: ITokenServicePort
	) {}

	async execute(
		command: AuthenticateWithPasswordCommand
	): Promise<AuthenticateWithPasswordCommandOutput> {
		const { email, password } = command.input;

		try {
			// Step 1: Authenticate with identity provider (password verification)
			this.logger.log(`Password authentication for email: ${email}`);
			const authResult = await this.identityProvider.authenticateWithPassword({
				email,
				password,
			});

			const { profile } = authResult;

			// Step 2: Look up user by email
			this.logger.log(`Looking up user by email: ${email}`);
			const user = await this.userRepository.findByEmail(email);

			if (!user) {
				throw new Error(`User not found for email: ${email}`);
			}

			// Step 3: Create session for the user
			const sessionId = generateCUID();
			const now = new Date();
			const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

			const session = Session.create({
				id: sessionId,
				userId: user.Id.Value,
				createdAt: now,
				lastSeenAt: now,
				expiresAt,
			});

			user.addSession(session);
			await this.userRepository.save(user);
			this.logger.log(`Session created for user: ${user.Id.Value}`);

			// Step 4: Issue tokens
			this.logger.log(`Issuing tokens for user: ${user.Id.Value}`);
			const tokenPair = await this.tokenService.issueTokens({
				user,
				session,
			});

			return {
				userId: user.Id.Value,
				email: user.Email.Value,
				accessToken: tokenPair.accessToken,
				refreshToken: tokenPair.refreshToken,
				expiresIn: tokenPair.expiresIn,
			};
		} catch (error) {
			this.logger.error(
				`Password authentication failed: ${
					error instanceof Error ? error.message : String(error)
				}`
			);
			throw error;
		}
	}
}

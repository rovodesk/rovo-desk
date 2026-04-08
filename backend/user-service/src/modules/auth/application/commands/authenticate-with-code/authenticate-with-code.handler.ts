import { Injectable, Logger } from "@nestjs/common";
import { CommandHandler, type ICommandHandler } from "@nestjs/cqrs";
import { generateCUID } from "@zero-heads-lab/shared/utils";
import { User } from "../../modules/users/domain/entities/user.entity";
import type { IUserRepository } from "../../modules/users/domain/repositories/user.repository.port";
import { UserEmail } from "../../modules/users/domain/value-objects/email.vo";
import { Identity } from "../../modules/users/domain/value-objects/identity.vo";
import { Session } from "../../modules/users/domain/value-objects/session.vo";
import { UserId } from "../../modules/users/domain/value-objects/user-id.vo";
import type { IIdentityProviderPort } from "../ports/identity-provider.port";
import type { ITokenServicePort } from "../ports/token-service.port";
import {
	AuthenticateWithCodeCommand,
	type AuthenticateWithCodeCommandOutput,
} from "./authenticate-with-code.command";

@CommandHandler(AuthenticateWithCodeCommand)
@Injectable()
export class AuthenticateWithCodeCommandHandler
	implements
		ICommandHandler<
			AuthenticateWithCodeCommand,
			AuthenticateWithCodeCommandOutput
		>
{
	private readonly logger = new Logger(AuthenticateWithCodeCommandHandler.name);

	constructor(
		private readonly userRepository: IUserRepository,
		private readonly identityProvider: IIdentityProviderPort,
		private readonly tokenService: ITokenServicePort
	) {}

	async execute(
		command: AuthenticateWithCodeCommand
	): Promise<AuthenticateWithCodeCommandOutput> {
		const { provider, code, redirectUri, codeVerifier } = command.input;

		try {
			// Step 1: Exchange authorization code for identity profile
			this.logger.log(
				`Exchanging authorization code with provider: ${provider}`
			);
			const authResult = await this.identityProvider.exchangeAuthorizationCode({
				provider,
				code,
				redirectUri,
				codeVerifier,
			});

			const { profile } = authResult;

			// Step 2: Check if user exists by identity
			this.logger.log(
				`Looking up user by identity: ${provider}:${profile.providerUserId}`
			);
			let user = await this.userRepository.findByIdentity(
				provider,
				profile.providerUserId
			);

			let isNewUser = false;

			// Step 3: If user doesn't exist, create new user
			if (!user) {
				isNewUser = true;
				this.logger.log(
					`Creating new user for identity: ${provider}:${profile.providerUserId}`
				);

				const userId = new UserId(generateCUID());
				const email = UserEmail.create(
					profile.email || `${profile.providerUserId}@${provider}.local`
				);

				const identity = Identity.create({
					provider,
					providerUserId: profile.providerUserId,
					email: profile.email,
					emailVerified: profile.emailVerified,
					linkedAt: new Date(),
					isPrimaryIdentity: true, // First identity is always primary
				});

				user = new User(userId, email, [identity], [], new Date(), new Date());

				// Persist new user
				await this.userRepository.save(user);
				this.logger.log(`New user created: ${userId.Value}`);
			}

			// Step 4: Create or retrieve session for the user
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

			// Step 5: Issue tokens
			this.logger.log(`Issuing tokens for user: ${user.Id.Value}`);
			const tokenPair = await this.tokenService.issueTokens({
				user,
				session,
			});

			return {
				userId: user.Id.Value,
				email: user.Email.Value,
				isNewUser,
				accessToken: tokenPair.accessToken,
				refreshToken: tokenPair.refreshToken,
				expiresIn: tokenPair.expiresIn,
			};
		} catch (error) {
			this.logger.error(
				`Authentication failed: ${error instanceof Error ? error.message : String(error)}`
			);
			throw error;
		}
	}
}

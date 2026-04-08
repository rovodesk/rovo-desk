import { generateCUID } from "@zero-heads-lab/shared/utils";
import type { UserService } from "@/domain/service";
import { Session } from "@/domain/value-objects/session.vo";
import { Status } from "@/domain/value-objects/session-status.vo";
import type { IEventBusPort } from "../ports/event-bus.port";
import type {
	IdentityAuthenticationResult,
	IIdentityProviderPort,
} from "../ports/identity-provider.port";
import type { ISessionRepository } from "../ports/session.repository.port";
import type { ITokenServicePort } from "../ports/token-service.port";
import type { IUserRepository } from "../ports/user.repository.port";

export interface AuthenticateUserUseCaseInput {
	provider: string;
	accessToken?: string;
	email?: string;
	password?: string;
	deviceName?: string;
	ipAddress?: string;
	userAgent?: string;
	expiresAt: Date;
}

export interface AuthenticateUserUseCaseOutput {
	userId: string;
	sessionId: string;
	accessToken: string;
	refreshToken?: string;
	idToken?: string;
	expiresIn: number;
}

export class AuthenticateUserUseCase {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly sessionRepository: ISessionRepository,
		private readonly identityProvider: IIdentityProviderPort,
		private readonly tokenService: ITokenServicePort,
		private readonly userService: UserService,
		private readonly eventBus: IEventBusPort
	) {}

	async execute(
		input: AuthenticateUserUseCaseInput
	): Promise<AuthenticateUserUseCaseOutput> {
		let authResult: IdentityAuthenticationResult;

		if (input.provider === "password") {
			if (!(input.email && input.password)) {
				throw new Error("Email and password are required");
			}

			authResult = await this.identityProvider.authenticateWithPassword({
				email: input.email,
				password: input.password,
			});
		} else {
			if (!input.accessToken) {
				throw new Error("Access token is required");
			}

			authResult = {
				subject: input.email ?? "",
				profile: await this.identityProvider.getProfile(
					input.provider as never,
					input.accessToken
				),
			};
		}

		const user = await this.userRepository.findByIdentity(
			authResult.profile.provider,
			authResult.profile.providerUserId
		);

		if (!user) {
			throw new Error("User not found. Signup flow required.");
		}

		this.userService.ensureUserCanAuthenticate(user);

		const session = new Session(
			generateCUID("session"),
			Status.active(),
			new Date(),
			new Date(),
			input.expiresAt,
			null
		);

		user.addSession(session);

		await this.userRepository.save(user);
		await this.sessionRepository.save(user.Id, session);

		const tokens = await this.tokenService.issueTokens({
			user,
			session,
		});

		await this.eventBus.publish({
			name: "auth.user.authenticated",
			aggregateId: user.Id.Value,
			occurredAt: new Date(),
			payload: {
				userId: user.Id,
				sessionId: session.id,
				provider: authResult.profile.provider,
			},
		});

		return {
			userId: user.Id.Value,
			sessionId: session.id,
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			idToken: tokens.idToken,
			expiresIn: tokens.expiresIn,
		};
	}
}

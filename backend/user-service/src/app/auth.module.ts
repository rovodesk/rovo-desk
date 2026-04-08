import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConnectionName } from "@zero-heads-lab/database/types";
import { IClockPort } from "@/app/ports/clock.port";
import { IEventBusPort } from "@/app/ports/event-bus.port";
import { IIdentityProviderPort } from "@/app/ports/identity-provider.port";
import { ISessionRepository } from "@/app/ports/session.repository.port";
import { ITokenServicePort } from "@/app/ports/token-service.port";
// Ports
import { IUserRepository } from "@/app/ports/user.repository.port";
import { AuthenticateUserUseCase } from "@/app/use-cases/authenticate-user.uc";
// Use Cases
import { CreateUserUseCase } from "@/app/use-cases/create-user.uc";
import { LinkIdentityUseCase } from "@/app/use-cases/link-identity.uc";
import { RevokeSessionUseCase } from "@/app/use-cases/revoke-session.uc";
import { UpdateEmailUseCase } from "@/app/use-cases/update-email.uc";
// Domain Services
import { UserService } from "@/domain/service";
// Tokens
import {
	AUTHENTICATE_USER_USE_CASE_TOKEN,
	CLOCK_PORT_TOKEN,
	CREATE_USER_USE_CASE_TOKEN,
	EVENT_BUS_PORT_TOKEN,
	IDENTITY_PROVIDER_PORT_TOKEN,
	LINK_IDENTITY_USE_CASE_TOKEN,
	REVOKE_SESSION_USE_CASE_TOKEN,
	SESSION_REPOSITORY_TOKEN,
	TOKEN_SERVICE_PORT_TOKEN,
	UPDATE_EMAIL_USE_CASE_TOKEN,
	USER_REPOSITORY_TOKEN,
	USER_SERVICE_TOKEN,
} from "@/infra/config/auth.tokens";
import { SessionRepository } from "@/infra/persistance/repositories/session.repository";
// Repositories
import { UserRepository } from "@/infra/persistance/repositories/user.repository";
import { UserIdentitySchema } from "@/infra/persistance/schemas/identity.schema";
import { UserSessionSchema } from "@/infra/persistance/schemas/session.schema";
// Schemas
import { UserSchema } from "@/infra/persistance/schemas/user.schema";
// Providers (Adapters)
import { ClockProvider } from "@/infra/providers/clock.provider";
import { CognitoProvider } from "@/infra/providers/cognito.provider";
import { EventBusProvider } from "@/infra/providers/event-bus.provider";
import { JWTProvider } from "@/infra/providers/jwt.provider";
import { IdentityController } from "@/presentation/controllers/identity.controller";
import { SessionController } from "@/presentation/controllers/session.controller";
// Controllers
import { UserController } from "@/presentation/controllers/user.controller";

/**
 * AuthModule
 *
 * Central module that wires up the entire authentication service.
 *
 * Responsibilities:
 * - Register repositories
 * - Register port implementations (providers/adapters)
 * - Register domain services
 * - Register use cases
 * - Register controllers
 *
 * Architecture:
 * - Controllers call use cases
 * - Use cases orchestrate domain services and repositories
 * - Repositories persist domain aggregates
 * - Providers adapt external services
 */
@Module({
	imports: [
		// TypeORM entities
		TypeOrmModule.forFeature(
			[UserSchema, UserIdentitySchema, UserSessionSchema],
			ConnectionName.AUTH
		),
	],
	providers: [
		// ========== Repositories ==========
		{
			provide: USER_REPOSITORY_TOKEN,
			useClass: UserRepository,
		},
		{
			provide: IUserRepository,
			useClass: UserRepository,
		},
		{
			provide: SESSION_REPOSITORY_TOKEN,
			useClass: SessionRepository,
		},
		{
			provide: ISessionRepository,
			useClass: SessionRepository,
		},

		// ========== Port Implementations (Infrastructure Adapters) ==========
		{
			provide: CLOCK_PORT_TOKEN,
			useClass: ClockProvider,
		},
		{
			provide: IClockPort,
			useClass: ClockProvider,
		},
		{
			provide: TOKEN_SERVICE_PORT_TOKEN,
			useClass: JWTProvider,
		},
		{
			provide: ITokenServicePort,
			useClass: JWTProvider,
		},
		{
			provide: EVENT_BUS_PORT_TOKEN,
			useClass: EventBusProvider,
		},
		{
			provide: IEventBusPort,
			useClass: EventBusProvider,
		},
		{
			provide: IDENTITY_PROVIDER_PORT_TOKEN,
			useClass: CognitoProvider,
		},
		{
			provide: IIdentityProviderPort,
			useClass: CognitoProvider,
		},

		// ========== Domain Services ==========
		{
			provide: USER_SERVICE_TOKEN,
			useClass: UserService,
		},

		// ========== Use Cases ==========
		{
			provide: CREATE_USER_USE_CASE_TOKEN,
			useFactory: (
				userRepo: IUserRepository,
				userService: UserService,
				eventBus: IEventBusPort
			) => new CreateUserUseCase(userRepo, userService, eventBus),
			inject: [IUserRepository, USER_SERVICE_TOKEN, IEventBusPort],
		},
		{
			provide: AUTHENTICATE_USER_USE_CASE_TOKEN,
			useFactory: (
				userRepo: IUserRepository,
				sessionRepo: ISessionRepository,
				idProvider: IIdentityProviderPort,
				tokenService: ITokenServicePort,
				userService: UserService,
				eventBus: IEventBusPort
			) =>
				new AuthenticateUserUseCase(
					userRepo,
					sessionRepo,
					idProvider,
					tokenService,
					userService,
					eventBus
				),
			inject: [
				IUserRepository,
				ISessionRepository,
				IIdentityProviderPort,
				ITokenServicePort,
				USER_SERVICE_TOKEN,
				IEventBusPort,
			],
		},
		{
			provide: LINK_IDENTITY_USE_CASE_TOKEN,
			useFactory: (userRepo: IUserRepository, eventBus: IEventBusPort) =>
				new LinkIdentityUseCase(userRepo, eventBus),
			inject: [IUserRepository, IEventBusPort],
		},
		{
			provide: REVOKE_SESSION_USE_CASE_TOKEN,
			useFactory: (
				userRepo: IUserRepository,
				sessionRepo: ISessionRepository,
				eventBus: IEventBusPort
			) => new RevokeSessionUseCase(userRepo, sessionRepo, eventBus),
			inject: [IUserRepository, ISessionRepository, IEventBusPort],
		},
		{
			provide: UPDATE_EMAIL_USE_CASE_TOKEN,
			useFactory: (userRepo: IUserRepository, eventBus: IEventBusPort) =>
				new UpdateEmailUseCase(userRepo, eventBus),
			inject: [IUserRepository, IEventBusPort],
		},

		// Controllers
		UserController,
		IdentityController,
		SessionController,
	],
	exports: [
		// Export repositories for other modules
		IUserRepository,
		ISessionRepository,

		// Export ports for other modules
		IClockPort,
		ITokenServicePort,
		IEventBusPort,
		IIdentityProviderPort,

		// Export domain service
		USER_SERVICE_TOKEN,

		// Export use cases
		CREATE_USER_USE_CASE_TOKEN,
		AUTHENTICATE_USER_USE_CASE_TOKEN,
		LINK_IDENTITY_USE_CASE_TOKEN,
		REVOKE_SESSION_USE_CASE_TOKEN,
		UPDATE_EMAIL_USE_CASE_TOKEN,
	],
})
export class AuthModule {}

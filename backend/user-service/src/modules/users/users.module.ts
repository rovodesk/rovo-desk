import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConnectionName } from "@zero-heads-lab/database/types";
import { EventBusProvider } from "@/infra/providers/event-bus.provider";
// Application - Handlers
import { CreateUserCommandHandler } from "./application/commands/create-user/create-user.handler";
import { UpdateEmailCommandHandler } from "./application/commands/update-email/update-email.handler";
import { IEventBusPort } from "./application/ports/event-bus.port";
import { GetUserByIdQueryHandler } from "./application/queries/get-user-by-id/get-user-by-id.handler";
// Ports
import { IUserRepository } from "./domain/repositories/user.repository.port";
// Domain
import { UserService } from "./domain/services/user.service";
import { UserMapper } from "./infrastructure/persistence/mappers/user.mapper";
// Infrastructure - Repositories & Mappers
import { UserRepository } from "./infrastructure/persistence/repositories/user.repository";
import { UserIdentitySchema } from "./infrastructure/persistence/schemas/identity.schema";
import { UserSessionSchema } from "./infrastructure/persistence/schemas/session.schema";
// Infrastructure - Schemas
import { UserSchema } from "./infrastructure/persistence/schemas/user.schema";
// Presentation
import { UserController } from "./presentation/http/controllers/user.controller";

const commandHandlers = [
	CreateUserCommandHandler,
	UpdateEmailCommandHandler,
	RevokeSessionCommandHandler,
	RevokeAllSessionsCommandHandler,
	TouchSessionCommandHandler,
];
const queryHandlers = [
	GetUserByIdQueryHandler,
	GetActiveSessionsByUserIdQueryHandler,
];

@Module({
	imports: [
		CqrsModule,
		TypeOrmModule.forFeature(
			[UserSchema, UserIdentitySchema, UserSessionSchema],
			ConnectionName.AUTH
		),
	],
	providers: [
		// ========== Domain Services ==========
		UserService,

		// ========== Repositories ==========
		{
			provide: IUserRepository,
			useClass: UserRepository,
		},

		// ========== Mappers ==========
		UserMapper,

		// ========== Ports - Event Bus (from external) ==========
		{
			provide: IEventBusPort,
			useClass: EventBusProvider,
		},

		// ========== CQRS Handlers ==========
		...commandHandlers,
		...queryHandlers,

		// ========== Controllers ==========
		UserController,
	],
	exports: [
		// Export ports for other modules
		IUserRepository,
		IEventBusPort,

		// Export domain service
		UserService,
	],
})
export class UsersModule {}

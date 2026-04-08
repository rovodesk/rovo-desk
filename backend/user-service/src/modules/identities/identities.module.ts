import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
// External imports (from users module and infra)
import { EventBusProvider } from "@/infra/providers/event-bus.provider";
import { UsersModule } from "../users/users.module";
// Application - Handlers
import { LinkIdentityCommandHandler } from "./application/commands/link-identity/link-identity.handler";
import { UnlinkIdentityCommandHandler } from "./application/commands/unlink-identity/unlink-identity.handler";
// Ports
import { IEventBusPort } from "./application/ports/event-bus.port";
// Presentation
import { IdentitiesController } from "./presentation/http/controllers/identities.controller";

const commandHandlers = [
	LinkIdentityCommandHandler,
	UnlinkIdentityCommandHandler,
];

@Module({
	imports: [CqrsModule, UsersModule],
	providers: [
		// ========== Ports - Event Bus (from external) ==========
		{
			provide: IEventBusPort,
			useClass: EventBusProvider,
		},

		// ========== CQRS Handlers ==========
		...commandHandlers,

		// ========== Controllers ==========
		IdentitiesController,
	],
	exports: [
		// Export port for other modules
		IEventBusPort,
	],
})
export class IdentitiesModule {}

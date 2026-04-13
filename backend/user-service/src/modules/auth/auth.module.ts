import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UsersModule } from "../users/users.module";

// Application - Handlers
import { AuthenticateWithCodeCommandHandler } from "./application/commands/authenticate-with-code/authenticate-with-code.handler";
import { AuthenticateWithPasswordCommandHandler } from "./application/commands/authenticate-with-password/authenticate-with-password.handler";
import { IIdentityProviderPort } from "./application/ports/identity-provider.port";
// Ports
import { ITokenServicePort } from "./application/ports/token-service.port";
import { CognitoProvider } from "./infrastructure/providers/cognito.provider";
// Infrastructure - Providers
import { JWTProvider } from "./infrastructure/providers/jwt.provider";

// Presentation
import { AuthController } from "./presentation/http/controllers/auth.controller";

const commandHandlers = [
	AuthenticateWithCodeCommandHandler,
	AuthenticateWithPasswordCommandHandler,
];

@Module({
	imports: [CqrsModule, UsersModule],
	providers: [
		// ========== Ports - Identity & Token Services ==========
		{
			provide: ITokenServicePort,
			useClass: JWTProvider,
		},
		{
			provide: IIdentityProviderPort,
			useClass: CognitoProvider,
		},

		// ========== CQRS Handlers ==========
		...commandHandlers,

		// ========== Controllers ==========
		AuthController,
	],
	exports: [
		// Export ports for other modules
		ITokenServicePort,
		IIdentityProviderPort,
	],
})
export class AuthModule {}

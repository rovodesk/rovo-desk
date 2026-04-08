import { Body, Controller, Post } from "@nestjs/common";
import type { CommandBus } from "@nestjs/cqrs";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthenticateWithCodeCommand } from "../../application/commands/authenticate-with-code/authenticate-with-code.command";
import { AuthenticateWithPasswordCommand } from "../../application/commands/authenticate-with-password/authenticate-with-password.command";
import type {
	AuthenticateWithCodeRequestDto,
	AuthenticateWithPasswordRequestDto,
	AuthenticationResponseDto,
} from "../http/dto/auth-request.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post("authenticate/code")
	@ApiOperation({
		summary:
			"Authenticate with OAuth authorization code (Google, GitHub, etc.)",
	})
	async authenticateWithCode(
		@Body() dto: AuthenticateWithCodeRequestDto
	): Promise<AuthenticationResponseDto> {
		const command = new AuthenticateWithCodeCommand({
			provider: dto.provider as any,
			code: dto.code,
			redirectUri: dto.redirectUri,
			codeVerifier: dto.codeVerifier,
		});

		const result = await this.commandBus.execute(command);

		return {
			tokens: {
				accessToken: result.accessToken,
				refreshToken: result.refreshToken,
				expiresIn: result.expiresIn,
				tokenType: "Bearer",
			},
			userId: result.userId,
			email: result.email,
			isNewUser: result.isNewUser,
		};
	}

	@Post("authenticate/password")
	@ApiOperation({ summary: "Authenticate with email and password" })
	async authenticateWithPassword(
		@Body() dto: AuthenticateWithPasswordRequestDto
	): Promise<AuthenticationResponseDto> {
		const command = new AuthenticateWithPasswordCommand({
			email: dto.email,
			password: dto.password,
		});

		const result = await this.commandBus.execute(command);

		return {
			tokens: {
				accessToken: result.accessToken,
				refreshToken: result.refreshToken,
				expiresIn: result.expiresIn,
				tokenType: "Bearer",
			},
			userId: result.userId,
			email: result.email,
			isNewUser: false, // Password auth is for existing users only
		};
	}
}

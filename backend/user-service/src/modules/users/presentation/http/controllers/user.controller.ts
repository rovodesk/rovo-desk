import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import type { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateUserCommand } from "../../application/commands/create-user/create-user.command";
import { UpdateEmailCommand } from "../../application/commands/update-email/update-email.command";
import type {
	CreateUserRequestDto,
	UpdateEmailRequestDto,
	UserResponseDto,
} from "../../application/dto/user-response.dto";
import { GetUserByIdQuery } from "../../application/queries/get-user-by-id/get-user-by-id.query";

@ApiTags("Users")
@Controller("users")
export class UserController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus
	) {}

	@Post()
	@ApiOperation({ summary: "Create a user" })
	async createUser(
		@Body() dto: CreateUserRequestDto
	): Promise<UserResponseDto | null> {
		const command = new CreateUserCommand({
			email: dto.email,
			provider: dto.provider,
			providerUserId: dto.providerUserId,
			isPrimary: dto.isPrimary,
		});

		const result = await this.commandBus.execute(command);
		return this.queryBus.execute(new GetUserByIdQuery(result.userId));
	}

	@Get(":userId")
	@ApiOperation({ summary: "Get a user by id" })
	@ApiParam({ name: "userId", example: "usr_demo123" })
	async getUser(
		@Param("userId") userId: string
	): Promise<UserResponseDto | null> {
		return this.queryBus.execute(new GetUserByIdQuery(userId));
	}

	@Post(":userId/email")
	@ApiOperation({ summary: "Update user email" })
	@ApiParam({ name: "userId", example: "usr_demo123" })
	async updateEmail(
		@Param("userId") userId: string,
		@Body() dto: UpdateEmailRequestDto
	): Promise<void> {
		const command = new UpdateEmailCommand({
			userId,
			email: dto.email,
		});

		await this.commandBus.execute(command);
	}

	@Get(":userId/sessions")
	@ApiOperation({ summary: "Get active sessions for a user" })
	@ApiParam({ name: "userId", example: "usr_demo123" })
	async getActiveSessions(
		@Param("userId") userId: string
	): Promise<SessionDto[]> {
		return this.queryBus.execute(new GetActiveSessionsByUserIdQuery(userId));
	}

	@Delete(":userId/sessions/:sessionId")
	@ApiOperation({ summary: "Revoke a specific session" })
	@ApiParam({ name: "userId", example: "usr_demo123" })
	@ApiParam({ name: "sessionId", example: "session_abc123" })
	async revokeSession(
		@Param("userId") userId: string,
		@Param("sessionId") sessionId: string
	): Promise<void> {
		const command = new RevokeSessionCommand({ userId, sessionId });
		await this.commandBus.execute(command);
	}

	@Delete(":userId/sessions")
	@ApiOperation({ summary: "Revoke all sessions for a user" })
	@ApiParam({ name: "userId", example: "usr_demo123" })
	async revokeAllSessions(@Param("userId") userId: string): Promise<void> {
		const command = new RevokeAllSessionsCommand({ userId });
		await this.commandBus.execute(command);
	}

	@Post(":userId/sessions/:sessionId/touch")
	@ApiOperation({ summary: "Update last seen time for a session" })
	@ApiParam({ name: "userId", example: "usr_demo123" })
	@ApiParam({ name: "sessionId", example: "session_abc123" })
	async touchSession(
		@Param("userId") userId: string,
		@Param("sessionId") sessionId: string
	): Promise<void> {
		const command = new TouchSessionCommand({ userId, sessionId });
		await this.commandBus.execute(command);
	}
}

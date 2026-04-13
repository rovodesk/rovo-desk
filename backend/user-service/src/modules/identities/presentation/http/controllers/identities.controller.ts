import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import type { CommandBus } from "@nestjs/cqrs";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { LinkIdentityCommand } from "../application/commands/link-identity/link-identity.command";
import { UnlinkIdentityCommand } from "../application/commands/unlink-identity/unlink-identity.command";

export class LinkIdentityDto {
	provider!: string;
	providerUserId!: string;
	email?: string | null;
	isPrimary?: boolean;
}

@ApiTags("Identities")
@Controller("users/:userId/identities")
export class IdentitiesController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post()
	@ApiOperation({ summary: "Link an identity to a user" })
	@ApiParam({ name: "userId", example: "usr_demo123" })
	async linkIdentity(
		@Param("userId") userId: string,
		@Body() dto: LinkIdentityDto
	): Promise<void> {
		const command = new LinkIdentityCommand({
			userId,
			provider: dto.provider,
			providerUserId: dto.providerUserId,
			email: dto.email,
			isPrimary: dto.isPrimary,
		});

		await this.commandBus.execute(command);
	}

	@Delete(":provider/:providerUserId")
	@ApiOperation({ summary: "Unlink an identity from a user" })
	@ApiParam({ name: "userId", example: "usr_demo123" })
	@ApiParam({ name: "provider", example: "google" })
	@ApiParam({ name: "providerUserId", example: "user_12345" })
	async unlinkIdentity(
		@Param("userId") userId: string,
		@Param("provider") provider: string,
		@Param("providerUserId") providerUserId: string
	): Promise<void> {
		const command = new UnlinkIdentityCommand({
			userId,
			provider,
			providerUserId,
		});

		await this.commandBus.execute(command);
	}
}

import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserDto } from "./dto/update-user.dto";
import type { UserResponseModel } from "./dto/user-response.dto";

@ApiTags("Users")
@Controller("users")
export class UserController {
	@Post()
	@ApiOperation({ summary: "Create a user" })
	createUser(@Body() dto: CreateUserDto): UserResponseModel {
		console.log("[UserController] createUser dto:", dto);

		return {
			id: "usr_demo123",
			identities: [
				{
					id: "identity_demo123",
					provider: "google",
					email: dto.email,
					emailVerified: true,
					linkedAt: new Date(),
					lastUsedAt: new Date(),
					isPrimary: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			firstName: dto.firstName ?? null,
			lastName: dto.lastName ?? null,
			avatarUrl: dto.avatarUrl ?? null,
			online: false,
			lastSeenAt: null,
			banned: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	@Get(":userId")
	@ApiOperation({ summary: "Get a user by id" })
	@ApiParam({ name: "userId", example: "usr_demo123" })
	getUser(@Param("userId") userId: string): UserResponseModel {
		console.log("[UserController] getUser userId:", userId);

		return {
			id: userId,
			identities: [
				{
					id: "identity_demo123",
					provider: "google",
					email: "dev@example.com",
					emailVerified: true,
					linkedAt: new Date(),
					lastUsedAt: new Date(),
					isPrimary: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			firstName: "Dev",
			lastName: "Mukherjee",
			avatarUrl: null,
			online: true,
			lastSeenAt: new Date(),
			banned: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	@Patch(":userId")
	@ApiOperation({ summary: "Update a user" })
	@ApiParam({ name: "userId", example: "usr_demo123" })
	updateUser(
		@Param("userId") userId: string,
		@Body() dto: UpdateUserDto
	): UserResponseModel {
		console.log("[UserController] updateUser userId:", userId);
		console.log("[UserController] updateUser dto:", dto);

		return {
			id: userId,
			identities: [],
			firstName: dto.firstName ?? "Dev",
			lastName: dto.lastName ?? "Mukherjee",
			avatarUrl: dto.avatarUrl ?? null,
			online: false,
			lastSeenAt: new Date(),
			banned: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}
}

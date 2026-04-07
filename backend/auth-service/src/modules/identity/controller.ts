import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import {
	ApiAcceptedResponse,
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiFoundResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";

import type { CreateUserIdentityDto } from "./dto/create-identity.dto";
import type { UserIdentityResponseModel } from "./dto/identiy-response.dto";
import type { LinkUserIdentityDto } from "./dto/link-user-identity.dto";
import type { SetPrimaryIdentityDto } from "./dto/set-primary-identity.dto";
import type { TouchIdentityDto } from "./dto/touch-identity.dto";
import type { UnlinkUserIdentityDto } from "./dto/unlink-user-identity.dto";
import type { UpdateEmailDto } from "./dto/update-email.dto";
import { SwagggerResponse } from "./swagger";

@ApiTags("Identities")
@Controller("identities")
export class IdentityController {
	/**
	 *
	 * Create a New User Identity
	 *
	 * @param {CreateUserIdentityDto} dto - Data transfer object containing the details of the identity to be created, including the user ID to attach to, provider information, and optional email metadata.
	 * @description Creates a new user identity based on the provided details. This endpoint allows for the creation of an identity linked to a specific user, with support for various authentication providers and associated metadata.
	 * @returns {UserIdentityResponseModel} - The response model representing the newly created user identity, including its ID, provider, email information, and timestamps for when it was linked and last used.
	 *
	 */
	@Post()
	@ApiOperation({ summary: "Create a New User Identity" })
	@ApiCreatedResponse(SwagggerResponse.createIdentity[201])
	@ApiBadRequestResponse(SwagggerResponse.createIdentity[400])
	@ApiInternalServerErrorResponse(SwagggerResponse.createIdentity[500])
	createIdentity(
		@Body() dto: CreateUserIdentityDto
	): UserIdentityResponseModel {
		console.log("[IdentityController] createIdentity dto:", dto);

		return {
			id: "iden_demo123",
			provider: dto.provider,
			email: dto.email ?? null,
			emailVerified: dto.emailVerified ?? false,
			isPrimary: dto.isPrimary ?? false,
			lastUsedAt: null,
			linkedAt: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	/**
	 *
	 * Get User Identity by ID
	 *
	 * @param {string} identityId - The unique identifier of the user identity to retrieve.
	 * @description Retrieves a user identity by its unique identifier. This endpoint allows clients to fetch detailed information about a specific identity, including its provider, email metadata, and usage timestamps.
	 * @returns {UserIdentityResponseModel} - The response model representing the user identity, including its ID, provider, email information, and timestamps for when it was linked and last used.
	 *
	 */

	@Get(":identityId")
	@ApiOperation({ summary: "Get User Identity by ID" })
	@ApiParam({ name: "identityId", example: "iden_demo123" })
	@ApiFoundResponse(SwagggerResponse.getIdentity[302])
	@ApiForbiddenResponse(SwagggerResponse.getIdentity[403])
	@ApiNotFoundResponse(SwagggerResponse.getIdentity[404])
	@ApiInternalServerErrorResponse(SwagggerResponse.getIdentity[500])
	getIdentity(
		@Param("identityId") identityId: string
	): UserIdentityResponseModel {
		console.log("[IdentityController] getIdentity identityId:", identityId);

		return {
			id: identityId,
			provider: "google",
			email: "dev@example.com",
			emailVerified: true,
			isPrimary: false,
			lastUsedAt: new Date(),
			linkedAt: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	/**
	 *
	 * Update Identity Email
	 *
	 * @param {string} identityId - The unique identifier of the user identity to update.
	 * @param {UpdateEmailDto} dto - Data transfer object containing the new email information for the identity, including the updated email address and its verification status.
	 * @description Updates the email metadata of a user identity. This endpoint allows clients to modify the email address associated with an identity, as well as its verification status, providing a way to keep identity information up to date.
	 * @returns {UserIdentityResponseModel} - The response model representing the updated user identity, including its ID, provider, updated email information, and timestamps for when it was linked and last used.
	 *
	 */

	@Patch(":identityId/email")
	@ApiOperation({ summary: "Update Identity Email" })
	@ApiParam({ name: "identityId", example: "iden_demo123" })
	@ApiAcceptedResponse(SwagggerResponse.updateEmail[202])
	@ApiForbiddenResponse(SwagggerResponse.updateEmail[403])
	@ApiNotFoundResponse(SwagggerResponse.updateEmail[404])
	@ApiInternalServerErrorResponse(SwagggerResponse.updateEmail[500])
	updateIdentityEmail(
		@Param("identityId") identityId: string,
		@Body() dto: UpdateEmailDto
	): UserIdentityResponseModel {
		console.log(
			"[IdentityController] updateIdentityEmail identityId:",
			identityId
		);
		console.log("[IdentityController] updateIdentityEmail dto:", dto);

		return {
			id: identityId,
			provider: "google",
			email: dto.email ?? "dev@example.com",
			emailVerified: false,
			isPrimary: false,
			lastUsedAt: new Date(),
			linkedAt: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	/**
	 *
	 * Touch Identity Last-Used Timestamp
	 *
	 * @param {string} identityId - The unique identifier of the user identity to touch.
	 * @param {TouchIdentityDto} dto - Data transfer object containing the new last-used timestamp for the identity.
	 * @description Updates the last-used timestamp of a user identity. This endpoint allows clients to indicate that an identity has been used for authentication, which can be useful for tracking active identities and implementing features like automatic cleanup of stale identities.
	 * @returns {UserIdentityResponseModel} - The response model representing the touched user identity, including its ID, provider, email information, and updated timestamps for when it was last used and linked.
	 */

	@Post(":identityId/touch")
	@ApiOperation({ summary: "Touch Identity last-used Timestamp" })
	@ApiParam({ name: "identityId", example: "iden_demo123" })
	@ApiAcceptedResponse(SwagggerResponse.touchIdenty[202])
	@ApiNotFoundResponse(SwagggerResponse.touchIdenty[404])
	@ApiForbiddenResponse(SwagggerResponse.touchIdenty[403])
	@ApiInternalServerErrorResponse(SwagggerResponse.touchIdenty[500])
	touchIdentity(
		@Param("identityId") identityId: string,
		@Body() dto: TouchIdentityDto
	): UserIdentityResponseModel {
		console.log("[IdentityController] touchIdentity identityId:", identityId);
		console.log("[IdentityController] touchIdentity dto:", dto);

		return {
			id: identityId,
			provider: "google",
			email: "dev@example.com",
			emailVerified: true,
			isPrimary: false,
			lastUsedAt: dto.lastUsedAt ? new Date(dto.lastUsedAt) : new Date(),
			linkedAt: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	/**
	 *
	 * Link Identity to Current User
	 *
	 * @param {LinkUserIdentityDto} dto - Data transfer object containing the details of the identity to be linked, including provider information and optional email metadata.
	 * @description Links a new identity to the current user. This endpoint allows clients to associate additional authentication providers with an existing user account, enabling features like social login and account linking.
	 * @returns {UserIdentityResponseModel} - The response model representing the newly linked user identity, including its ID, provider, email information, and timestamps for when it was linked and last used.
	 *
	 */

	@Post("link")
	@ApiOperation({ summary: "Link Identity to Current User" })
	@ApiCreatedResponse(SwagggerResponse.linkIdentitySelf[201])
	@ApiBadRequestResponse(SwagggerResponse.linkIdentitySelf[400])
	@ApiInternalServerErrorResponse(SwagggerResponse.linkIdentitySelf[500])
	linkIdentity(@Body() dto: LinkUserIdentityDto): UserIdentityResponseModel {
		console.log("[IdentityController] linkIdentity dto:", dto);

		return {
			id: "iden_linked123",
			provider: dto.provider,
			email: dto.email ?? null,
			emailVerified: dto.emailVerified ?? false,
			isPrimary: false,
			lastUsedAt: null,
			linkedAt: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	/**
	 *
	 * Unlink Identity from Current User
	 *
	 * @param {string} identityId - The unique identifier of the user identity to unlink.
	 * @param {UnlinkUserIdentityDto} dto - Data transfer object containing the reason for unlinking the identity.
	 * @description Unlinks an identity from the current user. This endpoint allows clients to disassociate an authentication provider from a user account, which can be useful for account management and security purposes.
	 * @returns {object} - An object indicating the success of the unlinking operation, along with the ID of the unlinked identity and the reason for unlinking if provided.
	 *
	 */

	@Post(":identityId/unlink")
	@ApiOperation({ summary: "Unlink Identity from Current User" })
	@ApiParam({ name: "identityId", example: "iden_demo123" })
	@ApiAcceptedResponse(SwagggerResponse.unlinkIdentity[202])
	@ApiForbiddenResponse(SwagggerResponse.unlinkIdentity[403])
	@ApiNotFoundResponse(SwagggerResponse.unlinkIdentity[404])
	@ApiInternalServerErrorResponse(SwagggerResponse.unlinkIdentity[500])
	@ApiParam({ name: "identityId", example: "iden_demo123" })
	unlinkIdentity(
		@Param("identityId") identityId: string,
		@Body() dto: UnlinkUserIdentityDto
	) {
		console.log("[IdentityController] unlinkIdentity identityId:", identityId);
		console.log("[IdentityController] unlinkIdentity dto:", dto);

		return {
			success: true,
			identityId,
			reason: dto.reason ?? null,
		};
	}

	@Post("primary")
	@ApiOperation({ summary: "Set the Primary Identity" })
	@ApiAcceptedResponse(SwagggerResponse.setPrimaryIdentity[202])
	@ApiBadRequestResponse(SwagggerResponse.setPrimaryIdentity[400])
	@ApiForbiddenResponse(SwagggerResponse.setPrimaryIdentity[403])
	@ApiNotFoundResponse(SwagggerResponse.setPrimaryIdentity[404])
	@ApiInternalServerErrorResponse(SwagggerResponse.setPrimaryIdentity[500])
	setPrimaryIdentity(@Body() dto: SetPrimaryIdentityDto) {
		console.log("[IdentityController] setPrimaryIdentity dto:", dto);

		return {
			success: true,
			identityId: dto.identityId,
		};
	}
}

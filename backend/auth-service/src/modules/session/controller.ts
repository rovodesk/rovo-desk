import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

import type { CreateSessionDto } from "./dto/create-session.dto";
import type { ElevateSessionDto } from "./dto/elevate-session.dto";
import type { RevokeAllSessionsDto } from "./dto/revoke-all-sessions.dto";
import type { RevokeSessionDto } from "./dto/revoke-session.dto";
import type { UserSessionResponseModel } from "./dto/session-response.dto";
import type { TouchSessionDto } from "./dto/touch-session.dto";
import type { UpdateSessionDeviceDto } from "./dto/update-session-device.dto";
import type { UpdateSessionNetworkDto } from "./dto/update-session-network.dto";

@ApiTags("Sessions")
@Controller("sessions")
export class SessionController {
	@Post()
	@ApiOperation({ summary: "Create a session" })
	createSession(@Body() dto: CreateSessionDto): UserSessionResponseModel {
		console.log("[SessionController] createSession dto:", dto);

		return {
			id: "sess_demo123",
			isCurrent: false,
			status: "active",
			provider: dto.provider ?? null,
			authMethod: dto.authMethod ?? null,
			mfaVerified: dto.mfaVerified ?? false,
			deviceName: dto.deviceName ?? null,
			deviceType: dto.deviceType ?? null,
			browser: dto.browser ?? null,
			os: dto.os ?? null,
			location: dto.location ?? null,
			ipAddress: dto.ipAddress ?? null,
			issuedAt: new Date(),
			lastSeenAt: new Date(),
			expiresAt: new Date(dto.expiresAt),
			revokedAt: null,
			revokeReason: null,
			endedAt: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	@Get(":sessionId")
	@ApiOperation({ summary: "Get a session by id" })
	@ApiParam({ name: "sessionId", example: "sess_demo123" })
	getSession(@Param("sessionId") sessionId: string): UserSessionResponseModel {
		console.log("[SessionController] getSession sessionId:", sessionId);

		return {
			id: sessionId,
			isCurrent: true,
			status: "active",
			provider: "google",
			authMethod: "google",
			mfaVerified: true,
			deviceName: "Chrome on MacBook Pro",
			deviceType: "web",
			browser: "Chrome",
			os: "macOS",
			location: "Kolkata, IN",
			ipAddress: "203.0.113.10",
			issuedAt: new Date(),
			lastSeenAt: new Date(),
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
			revokedAt: null,
			revokeReason: null,
			endedAt: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	@Post(":sessionId/touch")
	@ApiOperation({ summary: "Touch session activity" })
	@ApiParam({ name: "sessionId", example: "sess_demo123" })
	touchSession(
		@Param("sessionId") sessionId: string,
		@Body() dto: TouchSessionDto
	): UserSessionResponseModel {
		console.log("[SessionController] touchSession sessionId:", sessionId);
		console.log("[SessionController] touchSession dto:", dto);

		return {
			id: sessionId,
			isCurrent: true,
			status: "active",
			provider: "google",
			authMethod: "google",
			mfaVerified: true,
			deviceName: "Chrome on MacBook Pro",
			deviceType: "web",
			browser: "Chrome",
			os: "macOS",
			location: "Kolkata, IN",
			ipAddress: "203.0.113.10",
			issuedAt: new Date(),
			lastSeenAt: dto.lastSeenAt ? new Date(dto.lastSeenAt) : new Date(),
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
			revokedAt: null,
			revokeReason: null,
			endedAt: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	@Patch(":sessionId/device")
	@ApiOperation({ summary: "Update session device metadata" })
	@ApiParam({ name: "sessionId", example: "sess_demo123" })
	updateSessionDevice(
		@Param("sessionId") sessionId: string,
		@Body() dto: UpdateSessionDeviceDto
	): UserSessionResponseModel {
		console.log(
			"[SessionController] updateSessionDevice sessionId:",
			sessionId
		);
		console.log("[SessionController] updateSessionDevice dto:", dto);

		return {
			id: sessionId,
			isCurrent: true,
			status: "active",
			provider: "google",
			authMethod: "google",
			mfaVerified: true,
			deviceName: dto.deviceName ?? null,
			deviceType: dto.deviceType ?? null,
			browser: dto.browser ?? null,
			os: dto.os ?? null,
			location: "Kolkata, IN",
			ipAddress: "203.0.113.10",
			issuedAt: new Date(),
			lastSeenAt: new Date(),
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
			revokedAt: null,
			revokeReason: null,
			endedAt: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	@Patch(":sessionId/network")
	@ApiOperation({ summary: "Update session network metadata" })
	@ApiParam({ name: "sessionId", example: "sess_demo123" })
	updateSessionNetwork(
		@Param("sessionId") sessionId: string,
		@Body() dto: UpdateSessionNetworkDto
	): UserSessionResponseModel {
		console.log(
			"[SessionController] updateSessionNetwork sessionId:",
			sessionId
		);
		console.log("[SessionController] updateSessionNetwork dto:", dto);

		return {
			id: sessionId,
			isCurrent: true,
			status: "active",
			provider: "google",
			authMethod: "google",
			mfaVerified: true,
			deviceName: "Chrome on MacBook Pro",
			deviceType: "web",
			browser: "Chrome",
			os: "macOS",
			location: dto.location ?? null,
			ipAddress: dto.ipAddress ?? null,
			issuedAt: new Date(),
			lastSeenAt: new Date(),
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
			revokedAt: null,
			revokeReason: null,
			endedAt: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	@Post(":sessionId/elevate")
	@ApiOperation({ summary: "Elevate a session (e.g. MFA verified)" })
	@ApiParam({ name: "sessionId", example: "sess_demo123" })
	elevateSession(
		@Param("sessionId") sessionId: string,
		@Body() dto: ElevateSessionDto
	): UserSessionResponseModel {
		console.log("[SessionController] elevateSession sessionId:", sessionId);
		console.log("[SessionController] elevateSession dto:", dto);

		return {
			id: sessionId,
			isCurrent: true,
			status: "active",
			provider: "google",
			authMethod: "google",
			mfaVerified: dto.mfaVerified,
			deviceName: "Chrome on MacBook Pro",
			deviceType: "web",
			browser: "Chrome",
			os: "macOS",
			location: "Kolkata, IN",
			ipAddress: "203.0.113.10",
			issuedAt: new Date(),
			lastSeenAt: new Date(),
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
			revokedAt: null,
			revokeReason: null,
			endedAt: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	@Post(":sessionId/revoke")
	@ApiOperation({ summary: "Revoke a single session" })
	@ApiParam({ name: "sessionId", example: "sess_demo123" })
	revokeSession(
		@Param("sessionId") sessionId: string,
		@Body() dto: RevokeSessionDto
	) {
		console.log("[SessionController] revokeSession sessionId:", sessionId);
		console.log("[SessionController] revokeSession dto:", dto);

		return {
			success: true,
			sessionId,
			revokeReason: dto.revokeReason ?? "user_logout",
		};
	}

	@Post("revoke-all")
	@ApiOperation({ summary: "Revoke all sessions" })
	revokeAllSessions(@Body() dto: RevokeAllSessionsDto) {
		console.log("[SessionController] revokeAllSessions dto:", dto);

		return {
			success: true,
			excludeCurrent: dto.excludeCurrent ?? false,
			revokeReason: dto.revokeReason ?? "logout_all",
		};
	}
}

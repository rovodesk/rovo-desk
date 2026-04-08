import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserSessionResponseModel {
	@ApiProperty({
		example: "sess_y2m8q4n7r1k6v9x3c5p0z2td",
	})
	id!: string;

	@ApiProperty({
		example: "active",
		enum: ["active", "revoked", "expired", "ended", "suspended"],
		description: "Current lifecycle state of the session",
	})
	status!: string;

	@ApiProperty({
		example: true,
		description:
			"Whether this session is the current active session for the user",
	})
	isCurrent!: boolean;

	@ApiPropertyOptional({
		example: "google",
		description: "Provider used to establish the session",
	})
	provider?: string | null;

	@ApiPropertyOptional({
		example: "google",
		description: "Authentication method used for this session",
	})
	authMethod?: string | null;

	@ApiProperty({
		example: true,
		description: "Whether MFA was verified for this session",
	})
	mfaVerified!: boolean;

	@ApiPropertyOptional({
		example: "Chrome on MacBook Pro",
		description: "Human-readable device label",
	})
	deviceName?: string | null;

	@ApiPropertyOptional({
		example: "web",
		description: "Session device type",
	})
	deviceType?: string | null;

	@ApiPropertyOptional({
		example: "Chrome",
		description: "Browser used by the session",
	})
	browser?: string | null;

	@ApiPropertyOptional({
		example: "macOS",
		description: "Operating system of the device",
	})
	os?: string | null;

	@ApiPropertyOptional({
		example: "Kolkata, IN",
		description: "Approximate session location",
	})
	location?: string | null;

	@ApiPropertyOptional({
		example: "203.0.113.10",
		description: "IP address seen for the session",
	})
	ipAddress?: string | null;

	@ApiProperty({
		type: String,
		format: "date-time",
		example: "2026-04-01T10:00:00.000Z",
		description: "When the session was first issued",
	})
	issuedAt!: Date;

	@ApiProperty({
		type: String,
		format: "date-time",
		example: "2026-04-08T12:00:00.000Z",
		description: "Last time the session was seen active",
	})
	lastSeenAt!: Date;

	@ApiProperty({
		type: String,
		format: "date-time",
		example: "2026-05-01T12:00:00.000Z",
		description: "Absolute session expiry time",
	})
	expiresAt!: Date;

	@ApiPropertyOptional({
		type: String,
		format: "date-time",
		example: "2026-04-08T12:30:00.000Z",
		description: "When the session was revoked, if applicable",
	})
	revokedAt?: Date | null;

	@ApiPropertyOptional({
		example: "logout_all",
		description: "Why the session was revoked",
	})
	revokeReason?: string | null;

	@ApiPropertyOptional({
		type: String,
		format: "date-time",
		example: "2026-04-08T12:30:00.000Z",
		description: "When the session ended naturally or by logout",
	})
	endedAt?: Date | null;

	@ApiProperty({
		type: String,
		format: "date-time",
		example: "2026-04-01T10:00:00.000Z",
	})
	createdAt!: Date;

	@ApiProperty({
		type: String,
		format: "date-time",
		example: "2026-04-05T15:30:00.000Z",
	})
	updatedAt!: Date;
}

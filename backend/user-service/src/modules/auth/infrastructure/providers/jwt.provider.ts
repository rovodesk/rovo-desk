import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import type {
	ITokenServicePort,
	TokenClaims,
	TokenPair,
} from "../../application/ports/token-service.port";
import type { User } from "../../modules/users/domain/entities/user.entity";
import type { Session } from "../../modules/users/domain/value-objects/session.vo";

/**
 * JWTProvider
 *
 * Implements ITokenServicePort.
 * Handles JWT token issuance, verification, and opaque token hashing.
 *
 * CONFIGURATION:
 * - Environment variables should provide:
 *   - JWT_SECRET or RSA keys for signing
 *   - JWT_ACCESS_EXPIRY (default: 15m)
 *   - JWT_REFRESH_EXPIRY (default: 7d)
 */
@Injectable()
export class JWTProvider implements ITokenServicePort {
	private readonly secret =
		process.env.JWT_SECRET || "dev-secret-change-in-prod";
	private readonly accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || "15m";
	private readonly refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || "7d";

	/**
	 * Issue access and refresh tokens for an authenticated session.
	 */
	issueTokens(params: {
		user: User;
		session: Session;
		expiresInSeconds?: number;
	}): Promise<TokenPair> {
		const expiresIn = params.expiresInSeconds || 15 * 60; // Default 15 minutes

		// Access token claims
		const accessTokenClaims: TokenClaims = {
			sub: params.user.Id.Value,
			sessionId: params.session.id,
			email: params.user.Email.Value,
			scope: ["read", "write"],
		};

		// Refresh token claims
		const refreshTokenClaims: TokenClaims = {
			sub: params.user.Id.Value,
			sessionId: params.session.id,
		};

		const accessToken = jwt.sign(accessTokenClaims, this.secret, {
			expiresIn: this.accessTokenExpiry,
			algorithm: "HS256",
			issuer: "auth-service",
			audience: "api",
		});

		const refreshToken = jwt.sign(refreshTokenClaims, this.secret, {
			expiresIn: this.refreshTokenExpiry,
			algorithm: "HS256",
			issuer: "auth-service",
			audience: "api",
		});

		return Promise.resolve({
			accessToken,
			refreshToken,
			expiresIn,
			tokenType: "Bearer",
		});
	}

	/**
	 * Verify an access token and return claims.
	 */
	verifyAccessToken(token: string): Promise<TokenClaims> {
		try {
			const claims = jwt.verify(token, this.secret, {
				algorithms: ["HS256"],
				issuer: "auth-service",
				audience: "api",
			}) as TokenClaims;

			return Promise.resolve(claims);
		} catch (error) {
			return Promise.reject(
				new Error(
					`Invalid access token: ${
						error instanceof Error ? error.message : String(error)
					}`
				)
			);
		}
	}

	/**
	 * Verify a refresh token and return claims.
	 */
	verifyRefreshToken(token: string): Promise<TokenClaims> {
		try {
			const claims = jwt.verify(token, this.secret, {
				algorithms: ["HS256"],
				issuer: "auth-service",
				audience: "api",
			}) as TokenClaims;

			return Promise.resolve(claims);
		} catch (error) {
			return Promise.reject(
				new Error(
					`Invalid refresh token: ${
						error instanceof Error ? error.message : String(error)
					}`
				)
			);
		}
	}

	/**
	 * Hash an opaque token (for storing session tokens).
	 * Use SHA-256 to generate a hash safe to store in DB.
	 */
	hashOpaqueToken(token: string): Promise<string> {
		const hash = crypto.createHash("sha256").update(token).digest("hex");
		return Promise.resolve(hash);
	}

	/**
	 * Generate a random opaque token (for session storage).
	 * Used when JWT alone is insufficient (e.g., for opaque server sessions).
	 */
	generateOpaqueToken(): Promise<string> {
		const token = crypto.randomBytes(32).toString("hex");
		return Promise.resolve(token);
	}
}

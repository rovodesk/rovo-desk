/**
 * auth.tokens.ts
 *
 * NestJS injection tokens for DI configuration.
 * Used as keys for module registration and injection.
 *
 * Convention: UPPERCASE with LEADING UNDERSCORE for constants used as tokens
 */

// ==================== REPOSITORIES ====================

export const USER_REPOSITORY_TOKEN = Symbol("IUserRepository");
export const SESSION_REPOSITORY_TOKEN = Symbol("ISessionRepository");

// ==================== PORTS (Adapters) ====================

export const IDENTITY_PROVIDER_PORT_TOKEN = Symbol("IIdentityProviderPort");
export const TOKEN_SERVICE_PORT_TOKEN = Symbol("ITokenServicePort");
export const EVENT_BUS_PORT_TOKEN = Symbol("IEventBusPort");
export const CLOCK_PORT_TOKEN = Symbol("IClockPort");

// ==================== DOMAIN SERVICES ====================

export const USER_SERVICE_TOKEN = Symbol("UserService");

// ==================== PROVIDERS ====================

export const COGNITO_PROVIDER_TOKEN = Symbol("CognitoProvider");
export const JWT_PROVIDER_TOKEN = Symbol("JWTProvider");
export const EVENT_BUS_PROVIDER_TOKEN = Symbol("EventBusProvider");
export const CLOCK_PROVIDER_TOKEN = Symbol("ClockProvider");

// ==================== USE CASES ====================

export const CREATE_USER_USE_CASE_TOKEN = Symbol("CreateUserUseCase");
export const AUTHENTICATE_USER_USE_CASE_TOKEN = Symbol(
	"AuthenticateUserUseCase"
);
export const LINK_IDENTITY_USE_CASE_TOKEN = Symbol("LinkIdentityUseCase");
export const REVOKE_SESSION_USE_CASE_TOKEN = Symbol("RevokeSessionUseCase");
export const UPDATE_EMAIL_USE_CASE_TOKEN = Symbol("UpdateEmailUseCase");
export const REVOKE_ALL_SESSIONS_USE_CASE_TOKEN = Symbol(
	"RevokeAllSessionsUseCase"
);
export const GET_USER_USE_CASE_TOKEN = Symbol("GetUserUseCase");

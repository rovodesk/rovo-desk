package auth

import (
	"fmt"
	"net/http"
)

// AuthError represents a structured authentication error
type AuthError struct {
	Code       string
	Message    string
	StatusCode int
	Details    map[string]interface{}
}

// Error implements the error interface
func (e *AuthError) Error() string {
	return e.Message
}

// NewAuthError creates a new auth error
func NewAuthError(code, message string, statusCode int) *AuthError {
	return &AuthError{
		Code:       code,
		Message:    message,
		StatusCode: statusCode,
		Details:    make(map[string]interface{}),
	}
}

// WithDetail adds detail information to the error
func (e *AuthError) WithDetail(key string, value interface{}) *AuthError {
	e.Details[key] = value
	return e
}

// Common Auth Errors
var (
	// Invalid request errors
	ErrInvalidEmail = NewAuthError(
		"INVALID_EMAIL",
		"Invalid email format",
		http.StatusBadRequest,
	)

	ErrInvalidPassword = NewAuthError(
		"INVALID_PASSWORD",
		"Password must be at least 8 characters",
		http.StatusBadRequest,
	)

	ErrInvalidOTP = NewAuthError(
		"INVALID_OTP",
		"Invalid or expired OTP",
		http.StatusBadRequest,
	)

	ErrOTPExpired = NewAuthError(
		"OTP_EXPIRED",
		"OTP has expired. Please request a new one",
		http.StatusBadRequest,
	)

	ErrTooManyOTPAttempts = NewAuthError(
		"TOO_MANY_OTP_ATTEMPTS",
		"Too many failed OTP attempts. Please try again later",
		http.StatusTooManyRequests,
	)

	// Authentication errors
	ErrMissingAuthSession = NewAuthError(
		"MISSING_AUTH_SESSION",
		"Authentication session not found. Please start a new login",
		http.StatusUnauthorized,
	)

	ErrMissingTokens = NewAuthError(
		"MISSING_TOKENS",
		"Authentication tokens not found. Please log in again",
		http.StatusUnauthorized,
	)

	ErrInvalidToken = NewAuthError(
		"INVALID_TOKEN",
		"Invalid or expired authentication token",
		http.StatusUnauthorized,
	)

	ErrTokenExpired = NewAuthError(
		"TOKEN_EXPIRED",
		"Authentication token has expired",
		http.StatusUnauthorized,
	)

	ErrRefreshTokenExpired = NewAuthError(
		"REFRESH_TOKEN_EXPIRED",
		"Refresh token has expired. Please log in again",
		http.StatusUnauthorized,
	)

	// User errors
	ErrUserNotFound = NewAuthError(
		"USER_NOT_FOUND",
		"User not found",
		http.StatusNotFound,
	)

	ErrUserAlreadyExists = NewAuthError(
		"USER_ALREADY_EXISTS",
		"User with this email already exists",
		http.StatusConflict,
	)

	ErrUserNotConfirmed = NewAuthError(
		"USER_NOT_CONFIRMED",
		"User account not confirmed",
		http.StatusForbidden,
	)

	ErrUserDisabled = NewAuthError(
		"USER_DISABLED",
		"User account is disabled",
		http.StatusForbidden,
	)

	// Cognito-specific errors
	ErrCognitoUserExists = NewAuthError(
		"USER_EXISTS",
		"User already exists in Cognito",
		http.StatusConflict,
	)

	ErrCognitoInvalidPassword = NewAuthError(
		"INVALID_PASSWORD_EXCEPTION",
		"Password does not meet requirements",
		http.StatusBadRequest,
	)

	ErrCognitoUserNotFound = NewAuthError(
		"USER_NOT_FOUND",
		"User not found in Cognito",
		http.StatusNotFound,
	)

	// Session errors
	ErrSessionExpired = NewAuthError(
		"SESSION_EXPIRED",
		"Session has expired",
		http.StatusUnauthorized,
	)

	ErrSessionMismatch = NewAuthError(
		"SESSION_MISMATCH",
		"Session ID mismatch. Possible replay attack",
		http.StatusUnauthorized,
	)

	// Rate limiting errors
	ErrRateLimited = NewAuthError(
		"RATE_LIMITED",
		"Too many requests. Please try again later",
		http.StatusTooManyRequests,
	)

	// Internal errors
	ErrInternalServer = NewAuthError(
		"INTERNAL_SERVER_ERROR",
		"An internal server error occurred",
		http.StatusInternalServerError,
	)

	ErrCognitoService = NewAuthError(
		"COGNITO_SERVICE_ERROR",
		"Cognito service error",
		http.StatusInternalServerError,
	)
)

// ErrorResponse represents an API error response
type ErrorResponse struct {
	Code      string                 `json:"code"`
	Message   string                 `json:"message"`
	Details   map[string]interface{} `json:"details,omitempty"`
	RequestID string                 `json:"request_id,omitempty"`
}

// NewErrorResponse creates an error response from an AuthError
func NewErrorResponse(err *AuthError, requestID string) ErrorResponse {
	return ErrorResponse{
		Code:      err.Code,
		Message:   err.Message,
		Details:   err.Details,
		RequestID: requestID,
	}
}

// CognitoErrorMapper maps Cognito error codes to AuthError
func CognitoErrorMapper(cognitoCode string, message string) *AuthError {
	switch cognitoCode {
	case "UserExistsException":
		return ErrCognitoUserExists
	case "InvalidPasswordException":
		return ErrCognitoInvalidPassword
	case "UserNotFoundException":
		return ErrCognitoUserNotFound
	case "NotAuthorizedException":
		return NewAuthError(
			"NOT_AUTHORIZED",
			"Invalid credentials",
			http.StatusUnauthorized,
		)
	case "CodeMismatchException":
		return ErrInvalidOTP
	case "ExpiredCodeException":
		return ErrOTPExpired
	case "TooManyRequestsException":
		return ErrRateLimited
	case "TooManyFailedAttemptsException":
		return ErrTooManyOTPAttempts
	case "InvalidParameterException":
		return NewAuthError(
			"INVALID_PARAMETER",
			message,
			http.StatusBadRequest,
		)
	case "UserNotConfirmedException":
		return ErrUserNotConfirmed
	case "UserDisabledException":
		return ErrUserDisabled
	default:
		return NewAuthError(
			"COGNITO_ERROR",
			fmt.Sprintf("Cognito error: %s", message),
			http.StatusInternalServerError,
		)
	}
}

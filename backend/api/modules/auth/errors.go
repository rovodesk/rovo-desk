package auth

import (
	"encore.dev/beta/errs"
)

var (
	ErrInvalidEmail = errs.B().
			Code(errs.InvalidArgument).
			Msg("invalid email format").
			Err()

	ErrInvalidPassword = errs.B().
				Code(errs.InvalidArgument).
				Msg("password must be at least 8 characters").
				Err()

	ErrInvalidOTP = errs.B().
			Code(errs.InvalidArgument).
			Msg("invalid or expired OTP").
			Err()

	ErrOTPExpired = errs.B().
			Code(errs.InvalidArgument).
			Msg("otp has expired").
			Err()

	ErrTooManyOTPAttempts = errs.B().
				Code(errs.ResourceExhausted).
				Msg("too many failed OTP attempts").
				Err()

	ErrMissingAuthSession = errs.B().
				Code(errs.Unauthenticated).
				Msg("authentication session not found").
				Err()

	ErrInvalidToken = errs.B().
			Code(errs.Unauthenticated).
			Msg("invalid or expired token").
			Err()

	ErrRefreshTokenExpired = errs.B().
				Code(errs.Unauthenticated).
				Msg("refresh token expired").
				Err()

	ErrUserNotFound = errs.B().
			Code(errs.NotFound).
			Msg("user not found").
			Err()

	ErrUserAlreadyExists = errs.B().
				Code(errs.AlreadyExists).
				Msg("user already exists").
				Err()

	ErrUserNotConfirmed = errs.B().
				Code(errs.PermissionDenied).
				Msg("user not confirmed").
				Err()

	ErrUserDisabled = errs.B().
			Code(errs.PermissionDenied).
			Msg("user disabled").
			Err()

	ErrRateLimited = errs.B().
			Code(errs.ResourceExhausted).
			Msg("too many requests").
			Err()

	ErrInternalServer = errs.B().
				Code(errs.Internal).
				Msg("internal server error").
				Err()
)

// CognitoErrorMapper maps Cognito error codes to AuthError
func CognitoErrorMapper(cognitoCode string, message string) error {
	switch cognitoCode {
	case "UserExistsException":
		return ErrUserAlreadyExists

	case "InvalidPasswordException":
		return ErrInvalidPassword

	case "UserNotFoundException":
		return ErrUserNotFound

	case "NotAuthorizedException":
		return errs.B().
			Code(errs.Unauthenticated).
			Msg("invalid credentials").
			Err()

	case "CodeMismatchException":
		return ErrInvalidOTP

	case "ExpiredCodeException":
		return ErrOTPExpired

	case "TooManyRequestsException":
		return ErrRateLimited

	case "TooManyFailedAttemptsException":
		return ErrTooManyOTPAttempts

	case "InvalidParameterException":
		return errs.B().
			Code(errs.InvalidArgument).
			Msg(message).
			Err()

	case "UserNotConfirmedException":
		return ErrUserNotConfirmed

	case "UserDisabledException":
		return ErrUserDisabled

	default:
		return errs.B().
			Code(errs.Internal).
			Msg("cognito error: " + message).
			Err()
	}
}

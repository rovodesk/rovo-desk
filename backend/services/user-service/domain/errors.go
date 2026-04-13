package domain

import (
	"errors"
)

var (
	ErrExternalIdRequired = errors.New("external id required")

	ErrInvalidUsername = errors.New("invalid username")
	ErrEmailExists     = errors.New("email already exists")
	ErrEmailNotFound   = errors.New("email not found")
	ErrIdentityExists  = errors.New("identity already linked")

	ErrInvalidPasswordHash = errors.New("invalid password hash")

	ErrInvalidMFACode     = errors.New("invalid mfa code")
	ErrMFAAlreadyVerified = errors.New("mfa already verified")
	ErrMFAFactorNotFound  = errors.New("mfa factor not found")

	ErrInvalidBackupCode  = errors.New("invalid backup code")
	ErrBackupCodeUsed     = errors.New("backup code already used")
	ErrBackupCodeNotFound = errors.New("backup code not found")
)

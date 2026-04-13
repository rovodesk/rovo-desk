package data

import (
	"context"

	"github.com/trust-none/user-service/data/schema"
)

type UserRepository interface {
	WithTx(ctx context.Context, fn func(repo UserRepository) error) error

	CreateUser(ctx context.Context, user *schema.User) error
	UpdateUser(ctx context.Context, user *schema.User) error

	GetUserByID(ctx context.Context, id string) (*schema.User, error)

	AddEmail(ctx context.Context, email *schema.EmailAddress) error
	SetPrimaryEmail(ctx context.Context, userID, emailID string) error

	AddIdentity(ctx context.Context, identity *schema.Identity) error

	SetPassword(ctx context.Context, password *schema.Password) error

	AddMFAFactor(ctx context.Context, factor *schema.MFAFactor) error

	AddBackupCodes(ctx context.Context, codes []schema.BackupCode) error
}

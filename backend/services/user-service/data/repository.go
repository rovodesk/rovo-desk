package data

import (
	"context"
	"log/slog"

	"github.com/trust-none/user-service/data/schema"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"
	"gorm.io/gorm"
)

type userRepo struct {
	db     *gorm.DB
	tracer trace.Tracer
	logger *slog.Logger
}

func NewUserRepository(db *gorm.DB, tracer trace.Tracer, logger *slog.Logger) UserRepository {
	return &userRepo{db: db, tracer: tracer, logger: logger}
}

func (r *userRepo) startSpan(ctx context.Context, name string) (context.Context, trace.Span) {
	return r.tracer.Start(ctx, "userRepo."+name)
}

func (r *userRepo) WithTx(ctx context.Context, fn func(repo UserRepository) error) error {
	ctx, span := r.startSpan(ctx, "WithTx")
	defer span.End()

	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		txRepo := &userRepo{
			db:     tx,
			tracer: r.tracer,
			logger: r.logger,
		}
		return fn(txRepo)
	})

	if err != nil {
		span.RecordError(err)
		r.logger.ErrorContext(ctx, "transaction failed", "error", err)
		return err
	}

	r.logger.DebugContext(ctx, "transaction committed")
	return nil
}

func (r *userRepo) CreateUser(ctx context.Context, user *schema.User) error {
	ctx, span := r.startSpan(ctx, "CreateUser")
	defer span.End()

	span.SetAttributes(
		attribute.String("user.id", user.ID),
		attribute.String("tenant.id", user.TenantID),
	)

	err := r.db.WithContext(ctx).Create(user).Error
	if err != nil {
		span.RecordError(err)
		r.logger.ErrorContext(ctx, "failed to create user",
			"user_id", user.ID,
			"error", err,
		)
		return err
	}

	r.logger.InfoContext(ctx, "user created", "user_id", user.ID)
	return nil
}

func (r *userRepo) GetUserByID(ctx context.Context, id string) (*schema.User, error) {
	var user schema.User

	err := r.db.WithContext(ctx).
		Preload("Emails").
		Preload("Identities").
		Preload("Passwords").
		Preload("MFAFactors").
		Preload("BackupCodes").
		First(&user, "id = ?", id).Error

	return &user, err
}

func (r *userRepo) UpdateUser(ctx context.Context, user *schema.User) error {
	ctx, span := r.startSpan(ctx, "UpdateUser")
	defer span.End()

	span.SetAttributes(attribute.String("user.id", user.ID))

	err := r.db.WithContext(ctx).Save(user).Error
	if err != nil {
		span.RecordError(err)
		r.logger.ErrorContext(ctx, "failed to update user",
			"user_id", user.ID,
			"error", err,
		)
		return err
	}

	r.logger.InfoContext(ctx, "user updated", "user_id", user.ID)
	return nil
}

func (r *userRepo) AddEmail(ctx context.Context, email *schema.EmailAddress) error {
	ctx, span := r.startSpan(ctx, "AddEmail")
	defer span.End()

	span.SetAttributes(
		attribute.String("user.id", email.UserID),
		attribute.String("email", email.Email),
	)

	err := r.db.WithContext(ctx).Create(email).Error
	if err != nil {
		span.RecordError(err)
		r.logger.ErrorContext(ctx, "failed to add email",
			"user_id", email.UserID,
			"email", email.Email,
			"error", err,
		)
		return err
	}

	r.logger.InfoContext(ctx, "email added",
		"user_id", email.UserID,
		"email", email.Email,
	)

	return nil
}

func (r *userRepo) SetPrimaryEmail(ctx context.Context, userID, emailID string) error {
	ctx, span := r.startSpan(ctx, "SetPrimaryEmail")
	defer span.End()

	span.SetAttributes(
		attribute.String("user.id", userID),
		attribute.String("email.id", emailID),
	)

	tx := r.db.WithContext(ctx)

	if err := tx.Model(&schema.EmailAddress{}).
		Where("user_id = ?", userID).
		Update("is_primary", false).Error; err != nil {

		span.RecordError(err)
		r.logger.ErrorContext(ctx, "failed to unset primary emails",
			"user_id", userID,
			"error", err,
		)
		return err
	}

	err := tx.Model(&schema.EmailAddress{}).
		Where("id = ? AND user_id = ?", emailID, userID).
		Update("is_primary", true).Error

	if err != nil {
		span.RecordError(err)
		r.logger.ErrorContext(ctx, "failed to set primary email",
			"user_id", userID,
			"email_id", emailID,
			"error", err,
		)
		return err
	}

	r.logger.InfoContext(ctx, "primary email updated",
		"user_id", userID,
		"email_id", emailID,
	)

	return nil
}

func (r *userRepo) AddIdentity(ctx context.Context, identity *schema.Identity) error {
	ctx, span := r.startSpan(ctx, "AddIdentity")
	defer span.End()

	span.SetAttributes(
		attribute.String("user.id", identity.UserID),
		attribute.String("provider", identity.Provider),
	)

	err := r.db.WithContext(ctx).Create(identity).Error
	if err != nil {
		span.RecordError(err)
		r.logger.ErrorContext(ctx, "failed to add identity",
			"user_id", identity.UserID,
			"provider", identity.Provider,
			"error", err,
		)
		return err
	}

	r.logger.InfoContext(ctx, "identity added",
		"user_id", identity.UserID,
		"provider", identity.Provider,
	)

	return nil
}

func (r *userRepo) SetPassword(ctx context.Context, password *schema.Password) error {
	ctx, span := r.startSpan(ctx, "SetPassword")
	defer span.End()

	span.SetAttributes(
		attribute.String("user.id", password.UserID),
	)

	err := r.db.WithContext(ctx).Create(password).Error
	if err != nil {
		span.RecordError(err)
		r.logger.ErrorContext(ctx, "failed to set password",
			"user_id", password.UserID,
			"error", err,
		)
		return err
	}

	r.logger.InfoContext(ctx, "password set", "user_id", password.UserID)
	return nil
}

func (r *userRepo) AddMFAFactor(ctx context.Context, factor *schema.MFAFactor) error {
	ctx, span := r.startSpan(ctx, "AddMFAFactor")
	defer span.End()

	span.SetAttributes(
		attribute.String("user.id", factor.UserID),
		attribute.String("type", factor.Type),
	)

	err := r.db.WithContext(ctx).Create(factor).Error
	if err != nil {
		span.RecordError(err)
		r.logger.ErrorContext(ctx, "failed to add MFA factor",
			"user_id", factor.UserID,
			"type", factor.Type,
			"error", err,
		)
		return err
	}

	r.logger.InfoContext(ctx, "MFA factor added",
		"user_id", factor.UserID,
		"type", factor.Type,
	)

	return nil
}

func (r *userRepo) AddBackupCodes(ctx context.Context, codes []schema.BackupCode) error {
	ctx, span := r.startSpan(ctx, "AddBackupCodes")
	defer span.End()

	span.SetAttributes(
		attribute.String("user.id", codes[0].UserID),
	)

	err := r.db.WithContext(ctx).Create(&codes).Error
	if err != nil {
		span.RecordError(err)
		r.logger.ErrorContext(ctx, "failed to add backup codes",
			"user_id", codes[0].UserID,
			"error", err,
		)
		return err
	}

	r.logger.InfoContext(ctx, "backup codes added", "user_id", codes[0].UserID)
	return nil
}

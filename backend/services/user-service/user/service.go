package user

import (
	"context"
	"log/slog"

	"github.com/trust-none/user-service/data"
	"github.com/trust-none/user-service/domain"
	"github.com/trust-none/user-service/utils"
	"go.opentelemetry.io/otel/trace"
)

type userService struct {
	repo   data.UserRepository
	tracer trace.Tracer
	logger *slog.Logger
}

func NewUserService(repo data.UserRepository, tracer trace.Tracer, logger *slog.Logger) Service {
	return &userService{
		repo:   repo,
		tracer: tracer,
		logger: logger,
	}
}

func (s *userService) CreateUser(ctx context.Context, input CreateUserInput) (*UserResponse, error) {
	ctx, span := s.tracer.Start(ctx, "UserService.CreateUser")
	defer span.End()

	id := domain.NewID()
	tenantID := domain.ID(input.TenantID)

	username := ""
	if input.Username != nil {
		username = *input.Username
	}

	u, err := domain.NewUser(id, tenantID, username)
	if err != nil {
		s.logger.ErrorContext(ctx, "failed to create domain user", "error", err)
		return nil, err
	}

	if input.FirstName != nil || input.LastName != nil {
		u.SetName(utils.Ptr(input.FirstName), utils.Ptr(input.LastName))
	}

	err = s.repo.WithTx(ctx, func(txRepo data.UserRepository) error {
		schemaUser := ToSchemaUser(u)
		return txRepo.CreateUser(ctx, schemaUser)
	})
	if err != nil {
		s.logger.ErrorContext(ctx, "failed to persist user", "error", err)
		return nil, err
	}

	return ToResponseUser(u), nil
}

func (s *userService) GetUser(ctx context.Context, input GetUserInput) (*UserResponse, error) {
	ctx, span := s.tracer.Start(ctx, "UserService.GetUser")
	defer span.End()

	schemaUser, err := s.repo.GetUserByID(ctx, input.UserID)
	if err != nil {
		s.logger.ErrorContext(ctx, "user not found", "user_id", input.UserID)
		return nil, err
	}

	domainUser, err := ToDomainUser(schemaUser)
	if err != nil {
		return nil, err
	}

	return ToResponseUser(domainUser), nil
}

func (s *userService) UpdateUser(ctx context.Context, input UpdateUserInput) (*UserResponse, error) {
	ctx, span := s.tracer.Start(ctx, "UserService.UpdateUser")
	defer span.End()

	var updated *domain.User

	err := s.repo.WithTx(ctx, func(txRepo data.UserRepository) error {
		schemaUser, err := txRepo.GetUserByID(ctx, input.UserID)
		if err != nil {
			return err
		}

		u, err := ToDomainUser(schemaUser)
		if err != nil {
			return err
		}

		if input.FirstName != nil || input.LastName != nil {
			u.SetName(utils.Ptr(input.FirstName), utils.Ptr(input.LastName))
		}

		updated = u

		return txRepo.UpdateUser(ctx, ToSchemaUser(u))
	})

	if err != nil {
		return nil, err
	}

	return ToResponseUser(updated), nil
}

func (s *userService) SoftDeleteUser(ctx context.Context, input DeleteUserInput) error {
	ctx, span := s.tracer.Start(ctx, "UserService.SoftDeleteUser")
	defer span.End()

	return s.repo.WithTx(ctx, func(txRepo data.UserRepository) error {
		user, err := txRepo.GetUserByID(ctx, input.UserID)
		if err != nil {
			return err
		}

		return txRepo.UpdateUser(ctx, user) // assume soft delete flag inside repo later
	})
}

func (s *userService) ListUsers(ctx context.Context, input ListUsersInput) (*ListUsersResponse, error) {
	ctx, span := s.tracer.Start(ctx, "UserService.ListUsers")
	defer span.End()

	// TODO: implement repo.ListUsers(...)
	users := []UserResponse{}

	return &ListUsersResponse{
		Data: users,
		Meta: PaginationMeta{
			Limit:   input.Limit,
			Offset:  input.Offset,
			Total:   0,
			HasNext: false,
		},
	}, nil
}

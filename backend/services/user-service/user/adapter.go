package user

import (
	"context"
)

type Service interface {
	CreateUser(ctx context.Context, input CreateUserInput) (*UserResponse, error)
	GetUser(ctx context.Context, input GetUserInput) (*UserResponse, error)
	UpdateUser(ctx context.Context, input UpdateUserInput) (*UserResponse, error)
	SoftDeleteUser(ctx context.Context, input DeleteUserInput) error

	ListUsers(ctx context.Context, input ListUsersInput) (*ListUsersResponse, error)
}

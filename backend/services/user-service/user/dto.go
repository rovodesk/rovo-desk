package user

//////////////////////////////////////////////////////
// 📥 CREATE
//////////////////////////////////////////////////////

type CreateUserInput struct {
	TenantID  string  `json:"tenant_id" validate:"required"`
	Username  *string `json:"username,omitempty"`
	FirstName *string `json:"first_name,omitempty"`
	LastName  *string `json:"last_name,omitempty"`
}

//////////////////////////////////////////////////////
// ✏️ UPDATE
//////////////////////////////////////////////////////

type UpdateUserInput struct {
	UserID   string `json:"user_id" validate:"required"`
	TenantID string `json:"tenant_id" validate:"required"`

	FirstName *string `json:"first_name,omitempty"`
	LastName  *string `json:"last_name,omitempty"`
	AvatarURL *string `json:"avatar_url,omitempty"`
}

//////////////////////////////////////////////////////
// ❌ DELETE
//////////////////////////////////////////////////////

type DeleteUserInput struct {
	UserID   string `json:"user_id" validate:"required"`
	TenantID string `json:"tenant_id" validate:"required"`
}

//////////////////////////////////////////////////////
// 🔍 GET SINGLE
//////////////////////////////////////////////////////

type GetUserInput struct {
	UserID   string `json:"user_id" validate:"required"`
	TenantID string `json:"tenant_id" validate:"required"`
}

//////////////////////////////////////////////////////
// 📄 PAGINATION INPUT
//////////////////////////////////////////////////////

type PaginationQuery struct {
	Limit  int    `json:"limit,omitempty"`  // e.g. 10, 20
	Offset int    `json:"offset,omitempty"` // offset-based pagination
	Cursor string `json:"cursor,omitempty"` // for cursor pagination (future)
}

type ListUsersInput struct {
	TenantID string `json:"tenant_id" validate:"required"`

	PaginationQuery
}

//////////////////////////////////////////////////////
// 📤 RESPONSE: USER
//////////////////////////////////////////////////////

type UserResponse struct {
	ID       string `json:"id"`
	TenantID string `json:"tenant_id"`
	Username string `json:"username"`

	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`

	Emails     []string `json:"emails"`
	Identities []string `json:"identities"`

	MFAEnabled bool `json:"mfa_enabled"`

	CreatedAt string `json:"created_at"`
}

//////////////////////////////////////////////////////
// 📤 RESPONSE: PAGINATED LIST
//////////////////////////////////////////////////////

type PaginationMeta struct {
	Limit  int   `json:"limit"`
	Offset int   `json:"offset"`
	Total  int64 `json:"total"`

	HasNext bool `json:"has_next"`
}

type ListUsersResponse struct {
	Data []UserResponse `json:"data"`
	Meta PaginationMeta `json:"meta"`
}

//////////////////////////////////////////////////////
// 📤 RESPONSE: SINGLE
//////////////////////////////////////////////////////

type GetUserResponse struct {
	Data UserResponse `json:"data"`
}

//////////////////////////////////////////////////////
// 📤 MUTATION RESPONSE
//////////////////////////////////////////////////////

type MutationResponse struct {
	Status string `json:"status"` // success | failed
}

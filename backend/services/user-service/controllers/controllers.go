package controllers

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/trust-none/user-service/user"
	"github.com/trust-none/user-service/utils"
)

type UserController struct {
	svc user.Service
}

func NewUserController(svc user.Service) *UserController {
	return &UserController{svc: svc}
}

//////////////////////////////////////////////////////
// ROUTES
//////////////////////////////////////////////////////

func (c *UserController) FrontendRoutes(r chi.Router) {
	r.Get("/v1/me", c.getMe)
	r.Patch("/v1/me", c.updateMe)
}

func (c *UserController) BackendRoutes(r chi.Router) {
	r.Get("/v1/users/{id}", c.getUser)
	r.Get("/v1/users", c.listUsers)
}

func (c *UserController) PlatformRoutes(r chi.Router) {
	r.Post("/v1/users", c.createUser)
	r.Patch("/v1/users/{id}", c.updateUser)
}

//////////////////////////////////////////////////////
// FRONTEND
//////////////////////////////////////////////////////

// @Summary Get current user
// @Description Get logged-in user
// @Tags User, Frontend
// @Produce json
// @Success 200 {object} user.UserResponse
// @Router /v1/me [get]
func (c *UserController) getMe(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	userID := r.Header.Get("X-User-ID")
	if userID == "" {
		utils.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "missing user id"})
		return
	}

	res, err := c.svc.GetUser(ctx, user.GetUserInput{
		UserID: userID,
	})
	if err != nil {
		utils.WriteJSON(w, http.StatusNotFound, map[string]string{"error": err.Error()})
		return
	}

	utils.WriteJSON(w, http.StatusOK, res)
}

// @Summary Update current user
// @Tags User, Frontend
// @Accept json
// @Produce json
// @Param body body user.UpdateUserInput true "Update user"
// @Success 200 {object} user.UserResponse
// @Router /v1/me [patch]
func (c *UserController) updateMe(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var input user.UpdateUserInput
	if err := utils.ReadJSON(r, &input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid body"})
		return
	}

	input.UserID = r.Header.Get("X-User-ID")

	res, err := c.svc.UpdateUser(ctx, input)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	utils.WriteJSON(w, http.StatusOK, res)
}

//////////////////////////////////////////////////////
// BACKEND
//////////////////////////////////////////////////////

// @Summary Get user by ID
// @Tags User, Backend
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} user.UserResponse
// @Router /v1/users/{id} [get]
func (c *UserController) getUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	id := chi.URLParam(r, "id")

	res, err := c.svc.GetUser(ctx, user.GetUserInput{
		UserID: id,
	})
	if err != nil {
		utils.WriteJSON(w, http.StatusNotFound, map[string]string{"error": err.Error()})
		return
	}

	utils.WriteJSON(w, http.StatusOK, res)
}

// @Summary List users
// @Tags User, Backend
// @Produce json
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} user.ListUsersResponse
// @Router /v1/users [get]
func (c *UserController) listUsers(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	query := user.ListUsersInput{
		PaginationQuery: user.PaginationQuery{
			Limit:  utils.QueryInt(r, "limit", 10),
			Offset: utils.QueryInt(r, "offset", 0),
		},
	}

	res, err := c.svc.ListUsers(ctx, query)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	utils.WriteJSON(w, http.StatusOK, res)
}

// @Summary Create user
// @Tags User, Backend
// @Accept json
// @Produce json
// @Param body body user.CreateUserInput true "Create user"
// @Success 201 {object} user.UserResponse
// @Router /v1/users [post]
func (c *UserController) createUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var input user.CreateUserInput
	if err := utils.ReadJSON(r, &input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid body"})
		return
	}

	res, err := c.svc.CreateUser(ctx, input)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	utils.WriteJSON(w, http.StatusCreated, res)
}

// @Summary Update user
// @Tags User, Backend
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param body body user.UpdateUserInput true "Update user"
// @Success 200 {object} user.UserResponse
// @Router /v1/users/{id} [patch]
func (c *UserController) updateUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	id := chi.URLParam(r, "id")

	var input user.UpdateUserInput
	if err := utils.ReadJSON(r, &input); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid body"})
		return
	}

	input.UserID = id

	res, err := c.svc.UpdateUser(ctx, input)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	utils.WriteJSON(w, http.StatusOK, res)
}

//////////////////////////////////////////////////////
// PLATFORM
//////////////////////////////////////////////////////

// @Summary List Instance users
// @Tags User, Platform
// @Produce json
// @Param limit query int false "Limit"
// @Param offset query int false "Offset"
// @Success 200 {object} user.ListUsersResponse
// @Router /v1/instance/users [get]
func (c *UserController) listInstanceUsers(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	query := user.ListUsersInput{
		TenantID: r.Header.Get("X-Tenant-ID"),
		PaginationQuery: user.PaginationQuery{
			Limit:  utils.QueryInt(r, "limit", 10),
			Offset: utils.QueryInt(r, "offset", 0),
		},
	}

	res, err := c.svc.ListUsers(ctx, query)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	utils.WriteJSON(w, http.StatusOK, res)
}

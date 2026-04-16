package handlers

import (
	"context"
	"log"

	"github.com/zero-heads-lab/onboard-user-lambda/internal/events"
)

type UserHandler struct{}

func NewUserHandler() *UserHandler {
	return &UserHandler{}
}

func (h *UserHandler) Name() string {
	return "user_upsert"
}

func (h *UserHandler) Handle(ctx context.Context, e events.UserSignupEvent) error {
	log.Println("Upserting user:", e.UserID)

	// TODO: DB upsert (ON CONFLICT DO UPDATE)
	return nil
}

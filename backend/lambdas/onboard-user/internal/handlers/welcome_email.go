package handlers

import (
	"context"
	"log"

	"github.com/zero-heads-lab/onboard-user-lambda/internal/events"
)

type EmailHandler struct{}

func NewEmailHandler() *EmailHandler {
	return &EmailHandler{}
}

func (h *EmailHandler) Name() string {
	return "welcome_email"
}

func (h *EmailHandler) Handle(ctx context.Context, e events.UserSignupEvent) error {
	log.Println("Sending welcome email:", e.Email)

	// TODO: SES / SendGrid
	return nil
}

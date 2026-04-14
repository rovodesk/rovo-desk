package handlers

import (
	"context"
	"log"

	"github.com/zero-heads-lab/onboard-user-lambda/internal/events"
	"github.com/zero-heads-lab/onboard-user-lambda/internal/idempotency"
)

type AnalyticsHandler struct {
	idempotency idempotency.Store
}

func NewAnalyticsHandler(store idempotency.Store) *AnalyticsHandler {
	return &AnalyticsHandler{
		idempotency: store,
	}
}

func (h *AnalyticsHandler) Name() string {
	return "analytics"
}

func (h *AnalyticsHandler) Handle(ctx context.Context, e events.UserSignupEvent) error {
	log.Println("Sending analytics:", e.UserID)

	// TODO: real analytics logic
	return nil
}

package orchestrator

import (
	"context"

	"github.com/zero-heads-lab/onboard-user-lambda/internal/events"
)

type Task interface {
	Name() string
	Handle(ctx context.Context, event events.UserSignupEvent) error
}

package orchestrator

import (
	"context"
	"fmt"
	"log"

	"github.com/zero-heads-lab/onboard-user-lambda/internal/events"
	"github.com/zero-heads-lab/onboard-user-lambda/internal/idempotency"
	"golang.org/x/sync/errgroup"
)

type Processor struct {
	// The individual tasks that need to be executed
	tasks []Task
	// The idempotency store to prevent duplicate processing
	idempotency idempotency.Store
	// The time to live for the lock
	lockTTL int
}

func NewProcessor(store idempotency.Store, ttl int, tasks ...Task) *Processor {
	return &Processor{
		tasks:       tasks,
		idempotency: store,
		lockTTL:     ttl,
	}
}

func (p *Processor) Process(ctx context.Context, event events.UserSignupEvent) error {
	key := fmt.Sprintf("%s:%s", event.Event, event.UserID)

	acquired, err := p.idempotency.Acquire(ctx, key, p.lockTTL)
	if err != nil {
		return err
	}

	if !acquired {
		log.Println("Skipping duplicate:", key)
		return nil
	}

	g, ctx := errgroup.WithContext(ctx)

	for _, task := range p.tasks {
		task := task // capture
		g.Go(func() error {
			log.Println("Running task:", task.Name())
			return task.Handle(ctx, event)
		})
	}

	if err := g.Wait(); err != nil {
		log.Println("Task failure:", err)
		return err
	}

	if err := p.idempotency.MarkDone(ctx, key); err != nil {
		return err
	}

	log.Println("Processed successfully:", event.UserID)
	return nil
}

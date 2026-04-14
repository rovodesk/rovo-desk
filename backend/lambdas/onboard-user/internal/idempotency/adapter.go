package idempotency

import "context"

// Store defines idempotency behavior
type Store interface {
	// Try to acquire lock (returns false if already processing/processed)
	Acquire(ctx context.Context, key string, ttlSeconds int) (bool, error)

	// Mark as completed (optional depending on strategy)
	MarkDone(ctx context.Context, key string) error
}

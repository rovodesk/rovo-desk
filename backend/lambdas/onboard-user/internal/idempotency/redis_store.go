package idempotency

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisStore struct {
	client *redis.Client
	prefix string
}

func NewRedisStore(client *redis.Client) *RedisStore {
	return &RedisStore{
		client: client,
		prefix: "idemp:",
	}
}

func (r *RedisStore) key(k string) string {
	return r.prefix + k
}

// Acquire lock using SET NX EX
func (r *RedisStore) Acquire(ctx context.Context, key string, ttlSeconds int) (bool, error) {
	lockKey := r.key(key)

	ok, err := r.client.SetNX(
		ctx,
		lockKey,
		"processing",
		time.Duration(ttlSeconds)*time.Second,
	).Result()

	if err != nil {
		return false, err
	}

	return ok, nil
}

// MarkDone → optional upgrade: persist "done" state
func (r *RedisStore) MarkDone(ctx context.Context, key string) error {
	doneKey := r.key(key)

	// overwrite with "done" and longer TTL
	return r.client.Set(
		ctx,
		doneKey,
		"done",
		24*time.Hour,
	).Err()
}

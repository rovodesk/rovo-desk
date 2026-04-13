package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/zero-heads-lab/auth-service/config"
)

type Store interface {
	Set(ctx context.Context, key string, value any, ttl time.Duration) error
	Get(ctx context.Context, key string, dest any) error
	Delete(ctx context.Context, key string) error
	Exists(ctx context.Context, key string) (bool, error)
	Close() error
	Ping(ctx context.Context) error
}

type redisStore struct {
	client     *redis.Client
	prefix     string
	DefaultTTL time.Duration
}

func NewRedisStore(config config.CacheConfig) (Store, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     config.Addr,
		Password: config.Password,
		DB:       config.DB,
	})
	// ping redis
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("redis ping error: %w", err)
	}

	return &redisStore{
		client:     client,
		prefix:     config.Prefix,
		DefaultTTL: config.DefaultTTL,
	}, nil
}

func (r *redisStore) buildKey(key string) string {
	return fmt.Sprintf("%s:%s", r.prefix, key)
}

func (r *redisStore) Set(ctx context.Context, key string, value any, ttl time.Duration) error {
	data, err := json.Marshal(value)
	if err != nil {
		return fmt.Errorf("redis marshal error: %w", err)
	}
	if ttl == 0 {
		ttl = r.DefaultTTL
	}

	return r.client.Set(ctx, r.buildKey(key), data, ttl).Err()
}

func (r *redisStore) Get(ctx context.Context, key string, dest any) error {
	data, err := r.client.Get(ctx, r.buildKey(key)).Bytes()
	if err != nil {
		if err == redis.Nil {
			return fmt.Errorf("cache miss")
		}
		return fmt.Errorf("redis get error: %w", err)
	}

	return json.Unmarshal(data, dest)
}

func (r *redisStore) Delete(ctx context.Context, key string) error {
	return r.client.Del(ctx, r.buildKey(key)).Err()
}

func (r *redisStore) Exists(ctx context.Context, key string) (bool, error) {
	count, err := r.client.Exists(ctx, r.buildKey(key)).Result()
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *redisStore) Close() error {
	return r.client.Close()
}

func (r *redisStore) Ping(ctx context.Context) error {
	return r.client.Ping(ctx).Err()
}

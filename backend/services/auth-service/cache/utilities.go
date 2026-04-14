package cache

import (
	"context"
	"fmt"
	"time"
)

// RateLimitChecker provides rate limiting utilities
type RateLimitChecker struct {
	store  Store
	prefix string
}

// NewRateLimitChecker creates a new rate limit checker
func NewRateLimitChecker(store Store, prefix string) *RateLimitChecker {
	return &RateLimitChecker{
		store:  store,
		prefix: prefix,
	}
}

// IsAllowed checks if an action is allowed under rate limit
func (r *RateLimitChecker) IsAllowed(ctx context.Context, key string, limit int, window time.Duration) (bool, int, error) {
	fullKey := fmt.Sprintf("%s:ratelimit:%s", r.prefix, key)

	var count int
	err := r.store.Get(ctx, fullKey, &count)

	// If key doesn't exist, set initial count
	if err != nil || err.Error() == "cache miss" {
		count = 0
	}

	// If we've exceeded the limit
	if count >= limit {
		return false, count, nil
	}

	// Increment counter
	count++
	_ = r.store.Set(ctx, fullKey, count, window)

	return true, count, nil
}

// Reset resets the rate limit counter for a key
func (r *RateLimitChecker) Reset(ctx context.Context, key string) error {
	fullKey := fmt.Sprintf("%s:ratelimit:%s", r.prefix, key)
	return r.store.Delete(ctx, fullKey)
}

// ============================================================================
// Session Validator
// ============================================================================

// SessionValidator provides session validation utilities
type SessionValidator struct {
	store  Store
	prefix string
}

// NewSessionValidator creates a new session validator
func NewSessionValidator(store Store, prefix string) *SessionValidator {
	return &SessionValidator{
		store:  store,
		prefix: prefix,
	}
}

// CreateSession creates a new session with validation data
func (s *SessionValidator) CreateSession(ctx context.Context, sessionID string, data map[string]interface{}, ttl time.Duration) error {
	fullKey := fmt.Sprintf("%s:session:%s", s.prefix, sessionID)
	return s.store.Set(ctx, fullKey, data, ttl)
}

// ValidateSession validates that a session exists and retrieves its data
func (s *SessionValidator) ValidateSession(ctx context.Context, sessionID string) (map[string]interface{}, error) {
	fullKey := fmt.Sprintf("%s:session:%s", s.prefix, sessionID)

	var sessionData map[string]interface{}
	err := s.store.Get(ctx, fullKey, &sessionData)
	if err != nil {
		return nil, fmt.Errorf("session validation failed: %w", err)
	}

	return sessionData, nil
}

// InvalidateSession invalidates a session
func (s *SessionValidator) InvalidateSession(ctx context.Context, sessionID string) error {
	fullKey := fmt.Sprintf("%s:session:%s", s.prefix, sessionID)
	return s.store.Delete(ctx, fullKey)
}

// ============================================================================
// Failed Attempt Tracker
// ============================================================================

// FailedAttemptTracker tracks failed authentication attempts for brute-force protection
type FailedAttemptTracker struct {
	store  Store
	prefix string
}

// NewFailedAttemptTracker creates a new failed attempt tracker
func NewFailedAttemptTracker(store Store, prefix string) *FailedAttemptTracker {
	return &FailedAttemptTracker{
		store:  store,
		prefix: prefix,
	}
}

// RecordFailure records a failed attempt
func (f *FailedAttemptTracker) RecordFailure(ctx context.Context, identifier string, window time.Duration) (count int, err error) {
	fullKey := fmt.Sprintf("%s:failed:%s", f.prefix, identifier)

	var attempts int
	_ = f.store.Get(ctx, fullKey, &attempts) // Ignore error if not found

	attempts++
	err = f.store.Set(ctx, fullKey, attempts, window)

	return attempts, err
}

// GetFailureCount gets the current failure count
func (f *FailedAttemptTracker) GetFailureCount(ctx context.Context, identifier string) (int, error) {
	fullKey := fmt.Sprintf("%s:failed:%s", f.prefix, identifier)

	var count int
	err := f.store.Get(ctx, fullKey, &count)
	if err != nil && err.Error() != "cache miss" {
		return 0, err
	}

	return count, nil
}

// IsBlocked checks if an identifier is blocked due to too many failures
func (f *FailedAttemptTracker) IsBlocked(ctx context.Context, identifier string, blockThreshold int) (bool, error) {
	count, err := f.GetFailureCount(ctx, identifier)
	if err != nil {
		return false, err
	}

	return count >= blockThreshold, nil
}

// ClearFailures clears the failure count for an identifier
func (f *FailedAttemptTracker) ClearFailures(ctx context.Context, identifier string) error {
	fullKey := fmt.Sprintf("%s:failed:%s", f.prefix, identifier)
	return f.store.Delete(ctx, fullKey)
}

// ============================================================================
// Session Tracker
// ============================================================================

// SessionTracker tracks active sessions for a user or resource
type SessionTracker struct {
	store  Store
	prefix string
}

// NewSessionTracker creates a new session tracker
func NewSessionTracker(store Store, prefix string) *SessionTracker {
	return &SessionTracker{
		store:  store,
		prefix: prefix,
	}
}

// RegisterSession registers a new active session
func (s *SessionTracker) RegisterSession(ctx context.Context, userID, sessionID string, ttl time.Duration) error {
	fullKey := fmt.Sprintf("%s:user_sessions:%s", s.prefix, userID)

	var sessionIDs []string
	_ = s.store.Get(ctx, fullKey, &sessionIDs) // Ignore error if not found

	// Add new session ID if not already present
	found := false
	for _, id := range sessionIDs {
		if id == sessionID {
			found = true
			break
		}
	}

	if !found {
		sessionIDs = append(sessionIDs, sessionID)
	}

	return s.store.Set(ctx, fullKey, sessionIDs, ttl)
}

// GetActiveSessions gets all active sessions for a user
func (s *SessionTracker) GetActiveSessions(ctx context.Context, userID string) ([]string, error) {
	fullKey := fmt.Sprintf("%s:user_sessions:%s", s.prefix, userID)

	var sessionIDs []string
	err := s.store.Get(ctx, fullKey, &sessionIDs)
	if err != nil && err.Error() != "cache miss" {
		return nil, err
	}

	if len(sessionIDs) == 0 {
		return []string{}, nil
	}

	return sessionIDs, nil
}

// InvalidateAllSessions invalidates all sessions for a user
func (s *SessionTracker) InvalidateAllSessions(ctx context.Context, userID string) error {
	fullKey := fmt.Sprintf("%s:user_sessions:%s", s.prefix, userID)
	return s.store.Delete(ctx, fullKey)
}

// RemoveSession removes a specific session from tracking
func (s *SessionTracker) RemoveSession(ctx context.Context, userID, sessionID string, ttl time.Duration) error {
	fullKey := fmt.Sprintf("%s:user_sessions:%s", s.prefix, userID)

	var sessionIDs []string
	_ = s.store.Get(ctx, fullKey, &sessionIDs)

	// Remove the session ID
	filtered := make([]string, 0)
	for _, id := range sessionIDs {
		if id != sessionID {
			filtered = append(filtered, id)
		}
	}

	if len(filtered) == 0 {
		return s.store.Delete(ctx, fullKey)
	}

	return s.store.Set(ctx, fullKey, filtered, ttl)
}

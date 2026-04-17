package events

import "time"

type shared struct {
	Payload   map[string]string `pubsub-attr:"payload"`
	Timestamp time.Time         `pubsub-attr:"timestamp"`
}

type AuthEventType string

const (
	SignedUp       AuthEventType = "signed_up"
	SignedIn       AuthEventType = "signed_in"
	RefreshedToken AuthEventType = "token_refreshed"
	UserConfirmed  AuthEventType = "user_confirmed"
)

type AuthEvent struct {
	UserID    string        `pubsub-attr:"user_id"`
	EventType AuthEventType `pubsub-attr:"event_type"`
	shared
}

type DocumentEventType string

const (
	DocumentCreated   DocumentEventType = "created"
	DocumentUpdated   DocumentEventType = "updated"
	DocumentPublished DocumentEventType = "published"
	DocumentArchived  DocumentEventType = "archived"
	DocumentDeleted   DocumentEventType = "deleted"
)

type DocumentEvent struct {
	DocumentID string            `pubsub-attr:"document_id"`
	EventType  DocumentEventType `pubsub-attr:"event_type"`
	ActorID    string            `pubsub-attr:"actor_id"`
	shared
}

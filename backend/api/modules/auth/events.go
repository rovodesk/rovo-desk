package auth

import (
	"encore.dev/pubsub"
	"github.com/zero-heads-lab/api/pkg/events"
)

var AuthEvents = pubsub.NewTopic[*events.AuthEvent]("auth-events", pubsub.TopicConfig{
	DeliveryGuarantee: pubsub.ExactlyOnce,
	OrderingAttribute: "user_id",
})

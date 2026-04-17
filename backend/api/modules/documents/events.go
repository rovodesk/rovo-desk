package documents

import (
	"encore.dev/pubsub"
	"github.com/zero-heads-lab/api/pkg/events"
)

var DocumentEvents = pubsub.NewTopic[*events.DocumentEvent]("document-events", pubsub.TopicConfig{
	DeliveryGuarantee: pubsub.ExactlyOnce,
	OrderingAttribute: "document_id",
})

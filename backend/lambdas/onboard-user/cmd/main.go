package main

import (
	"context"
	"encoding/json"
	"log"

	awsEvents "github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/redis/go-redis/v9"

	"github.com/zero-heads-lab/onboard-user-lambda/internal/events"
	"github.com/zero-heads-lab/onboard-user-lambda/internal/handlers"
	"github.com/zero-heads-lab/onboard-user-lambda/internal/idempotency"
	"github.com/zero-heads-lab/onboard-user-lambda/internal/orchestrator"
)

var processor *orchestrator.Processor

func init() {
	rdb := redis.NewClient(&redis.Options{
		Addr: "localhost:6379", // inject via env in prod
	})

	store := idempotency.NewRedisStore(rdb)

	processor = orchestrator.NewProcessor(
		store,
		60,
		handlers.NewUserHandler(),
		handlers.NewAnalyticsHandler(store),
		handlers.NewEmailHandler(),
	)
}

func handler(ctx context.Context, snsEvent awsEvents.SNSEvent) error {
	for _, record := range snsEvent.Records {
		var payload events.UserSignupEvent

		if err := json.Unmarshal([]byte(record.SNS.Message), &payload); err != nil {
			log.Println("Invalid message:", err)
			continue
		}

		if err := processor.Process(ctx, payload); err != nil {
			return err
		}
	}

	return nil
}

func main() {
	lambda.Start(handler)
}

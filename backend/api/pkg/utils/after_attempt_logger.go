package utils

import (
	"context"

	"encore.dev/rlog"
	"github.com/aws/aws-sdk-go-v2/aws/middleware"
	smithymiddleware "github.com/aws/smithy-go/middleware"
)

type AwsRequestLogger struct{}

func (a AwsRequestLogger) ID() string {
	return "AfterAttemptLogger"
}

func (a AwsRequestLogger) HandleFinalize(
	ctx context.Context,
	in smithymiddleware.FinalizeInput,
	next smithymiddleware.FinalizeHandler,
) (
	out smithymiddleware.FinalizeOutput,
	meta smithymiddleware.Metadata,
	err error,
) {
	out, meta, err = next.HandleFinalize(ctx, in)

	rlog.Debug("aws request attempt",
		"service", middleware.GetServiceID(ctx),
		"operation", middleware.GetOperationName(ctx),
		"error", err,
	)

	return out, meta, err
}

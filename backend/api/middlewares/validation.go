package middlewares

import (
	"encore.dev/beta/errs"
	"encore.dev/middleware"
)

//encore:middleware global target=all
func ValidationMiddleware(req middleware.Request, next middleware.Next) middleware.Response {
	// If the payload has a Validate method, use it to validate the request.
	payload := req.Data().Payload
	if validator, ok := payload.(interface{ Validate() error }); ok {
		if err := validator.Validate(); err != nil {
			// If the validation fails, return an InvalidArgument error.
			err = errs.WrapCode(err, errs.InvalidArgument, "validation failed")
			return middleware.Response{Err: err}
		}
	}
	return next(req)
}

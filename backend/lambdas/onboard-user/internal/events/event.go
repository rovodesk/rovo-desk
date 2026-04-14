package events

import "time"

type UserSignupEvent struct {
	Event     string    `json:"event"`
	UserID    string    `json:"userId"`
	Email     string    `json:"email"`
	Timestamp time.Time `json:"timestamp"`
}

export const EVENT_CATEGORIES = [
	"domain",
	"auth",
	"crm",
	"analytics",
	"integration",
	"system",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const EVENT_PRIORITIES = ["low", "normal", "high", "critical"] as const;

export type EventPriority = (typeof EVENT_PRIORITIES)[number];

export const ACTOR_TYPES = [
	"user",
	"system",
	"service",
	"admin",
	"api_key",
	"anonymous",
] as const;

export type ActorType = (typeof ACTOR_TYPES)[number];

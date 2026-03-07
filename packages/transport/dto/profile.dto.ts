import z from "zod";

export const UPDATE_ONBOARDING_PROGRESS_INPUT_DTO = z.object({
	currentStepId: z.string(),
	flowData: z.record(z.string(), z.unknown()),
});

export const GET_ONBOARDING_PROGRESS_OUTPUT_DTO = z.object({
	currentStepId: z.string().nullable(),
	flowData: z.record(z.string(), z.unknown()).optional(),
	startedAt: z.date().nullable(),
	completedAt: z.date().nullable(),
	skippedAt: z.date().nullable(),
});

export const UPDATE_WORKSPACE_SETTINGS_INPUT_DTO = z.object({
	settings: z.record(z.string(), z.unknown()),
});

export const TOGGLE_USER_AWAY_INPUT_DTO = z.object({
	isAway: z.boolean(),
});

export const USER_PROFILE_DTO = z.object({
	settings: z.record(z.string(), z.unknown()).nullable(),
	isAway: z.boolean(),
	workspaceProfileId: z.string().nullable(),
});

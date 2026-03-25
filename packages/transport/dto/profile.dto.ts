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

export const TOGGLE_USER_ACTIVE_INPUT_DTO = z.object({
	active: z.boolean(),
});

export const USER_PROFILE_DTO = z.object({
	settings: z.record(z.string(), z.unknown()).nullable(),
	active: z.boolean(),
	workspaceProfileId: z.string().nullable(),
});

export const GET_WORKSPACE_PROFILE_DTO = {
	settings: z.record(z.string(), z.unknown()).nullable(),
};

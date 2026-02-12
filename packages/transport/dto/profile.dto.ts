import z from "zod";

export const UPDATE_ONBOARDING_PROGRESS_INPUT_DTO = z.object({
	currentStepId: z.string(),
	flowData: z.record(z.string(), z.unknown()).optional(),
});

export const GET_ONBOARDING_PROGRESS_OUTPUT_DTO = z.object({
	currentStepId: z.string().nullable(),
	flowData: z.record(z.string(), z.unknown()).optional(),
	startedAt: z.date().nullable(),
});

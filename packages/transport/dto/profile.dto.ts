import { oc } from "@orpc/contract";
import z from "zod";

export const GET_PROFILE_BY_USER_ID_INPUT_DTO = z.object({
	userId: z.string(),
});

export const GET_PROFILE_BY_USER_ID_OUTPUT_DTO = z.object({
	id: z.string(),
	currentOnboardingStep: z.string().nullable(),
	onboardingStartedAt: z.string().datetime().nullable(),
	onboardingCompletedAt: z.string().datetime().nullable(),
	organizationId: z.string().nullable(),
	teamId: z.string().nullable(),
});

export const UPDATE_PROFILE_INPUT_DTO = z.object({
	name: z.string().min(3, "Name must be at least 3 characters long").optional(),
});

export const GET_PROFILE_BY_USER_ID = oc
	.input(GET_PROFILE_BY_USER_ID_INPUT_DTO)
	.output(GET_PROFILE_BY_USER_ID_OUTPUT_DTO);

export const UPDATE_PROFILE = oc
	.input(UPDATE_PROFILE_INPUT_DTO)
	.output(GET_PROFILE_BY_USER_ID_OUTPUT_DTO);

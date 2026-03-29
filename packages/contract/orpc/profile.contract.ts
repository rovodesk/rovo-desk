import { oc } from "@orpc/contract";
import { z } from "zod";
import {
	GET_ONBOARDING_PROGRESS_OUTPUT_DTO,
	GET_WORKSPACE_PROFILE_OUTPUT_DTO,
	TOGGLE_USER_ACTIVE_INPUT_DTO,
	UPDATE_ONBOARDING_PROGRESS_INPUT_DTO,
	UPDATE_WORKSPACE_SETTINGS_INPUT_DTO,
	USER_PROFILE_DTO,
} from "../dto/profile.dto";

export const loadProgress = oc
	.route({
		method: "GET",
		path: "/profile/onboarding-progress",
	})
	.output(GET_ONBOARDING_PROGRESS_OUTPUT_DTO);

export const persistProgress = oc
	.route({
		method: "POST",
		path: "/profile/onboarding-progress",
	})
	.input(UPDATE_ONBOARDING_PROGRESS_INPUT_DTO)
	.output(z.void());

export const clearProgress = oc
	.route({
		method: "DELETE",
		path: "/profile/onboarding-progress",
	})
	.input(z.object({}))
	.output(z.void());

export const updateWorkspaceSettings = oc
	.route({
		method: "PATCH",
		path: "/profile/workspace-settings",
	})
	.input(UPDATE_WORKSPACE_SETTINGS_INPUT_DTO)
	.output(z.void());

export const getWorkspaceProfile = oc
	.route({
		method: "GET",
		path: "/profile/workspace",
	})
	.output(GET_WORKSPACE_PROFILE_OUTPUT_DTO);

export const getUserProfile = oc
	.route({
		method: "GET",
		path: "/profile/user",
	})
	.output(USER_PROFILE_DTO);

export const toggleUserActive = oc
	.route({
		method: "POST",
		path: "/profile/toggle-user-active",
	})
	.input(TOGGLE_USER_ACTIVE_INPUT_DTO)
	.output(z.void());

export const ProfileContract = {
	onboarding: {
		loadProgress,
		persistProgress,
		clearProgress,
	},
	workspace: {
		updateWorkspaceSettings,
		getWorkspaceProfile,
	},
	user: {
		getUserProfile,
		toggleUserActive,
	},
};

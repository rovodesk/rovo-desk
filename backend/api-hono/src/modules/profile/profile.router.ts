import { implement } from "@orpc/server";
import { ProfileContract } from "@zero-heads-lab/contract/orpc/profile.contract";
import {
	clearProgress,
	getUserProfile,
	getWorkspaceProfile,
	loadProgress,
	persistProgress,
	toggleUserActive,
	updateWorkspaceSettings,
} from "./profile";

export const ProfileRouter = implement(ProfileContract).router({
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
});

import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createAuth } from "@zero-heads-lab/auth/server";
import { getProfileByUserId } from "@zero-heads-lab/database/repositories/profile/queries";

export const getCurrentProfile = createServerFn().handler(async () => {
	const headers = getRequestHeaders();
	// 1️⃣ Get authenticated user
	const auth = createAuth();
	const session = await auth.api.getSession({ headers });

	if (!session?.user?.id) {
		throw new Error("Unauthorized");
	}

	const userId = session.user.id;
	const existingProfile = await getProfileByUserId(userId);

	return existingProfile;
});

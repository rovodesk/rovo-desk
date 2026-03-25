import { usePostHog } from "@zero-heads-lab/analytics/client/hooks";
import { useEffect, useRef } from "react";
import { useSession } from "./use-session";

export function useIdentity() {
	const analytics = usePostHog();
	const { session } = useSession();

	const hasIdentified = useRef(false);

	useEffect(() => {
		if (!analytics) return;

		// 🟢 Logged in user
		if (session?.user?.id && !hasIdentified.current) {
			analytics.identify(session.user.id, {
				name: session.user.name,
				email: session.user.email,
				avatar: session.user.image,
			});

			hasIdentified.current = true;
			return;
		}

		// 🔴 Logged out
		if (!session && hasIdentified.current) {
			analytics.reset();
			hasIdentified.current = false;
		}
	}, [session, analytics]);
}

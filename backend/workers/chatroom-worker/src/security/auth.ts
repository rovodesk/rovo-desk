import type { Connection } from "partyserver";
import { ACTOR_ROLE } from "@/types";

export function resolveRole(connection: Connection): ACTOR_ROLE {
	try {
		const url = new URL(connection.uri!);
		const role = url.searchParams.get("role");

		if (role === ACTOR_ROLE.AGENT) {
			// TODO: validate auth token
			return ACTOR_ROLE.AGENT;
		}
	} catch {
		// ignore
	}

	return ACTOR_ROLE.USER;
}

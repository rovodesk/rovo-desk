import type { Connection } from "partyserver";

export interface IRateLimiter {
	allow(connection: Connection): Promise<boolean>;
}

import type { ITracer } from "@zero-heads-lab/analytics/lib/tracer";
import type { Database } from "@zero-heads-lab/database";
import { ProfileMutationRepository } from "./profile.mutation";
import { ProfileQueryRepository } from "./profile.query";
import type { IProfileRepository } from "./profile.type";

export class ProfileRepository implements IProfileRepository {
	readonly query: ProfileQueryRepository;
	readonly mutation: ProfileMutationRepository;

	constructor(db: Database, tracer: ITracer) {
		this.query = new ProfileQueryRepository(db, tracer);
		this.mutation = new ProfileMutationRepository(db, tracer);
	}
}
